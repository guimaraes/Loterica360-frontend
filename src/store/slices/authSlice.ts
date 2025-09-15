import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, LoginRequest, LoginResponse } from '../../types'
import { authService } from '../../services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false, // Mudança: não considerar token como autenticado automaticamente
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('token', response.token)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao fazer login')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      localStorage.removeItem('token')
      return null
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao fazer logout')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao obter usuário atual')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        console.log('Login fulfilled - payload:', action.payload)
        state.loading = false
        state.user = action.payload.usuario
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        console.log('Login fulfilled - state updated:', { user: state.user, isAuthenticated: state.isAuthenticated })
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        console.log('GetCurrentUser fulfilled - payload:', action.payload)
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
        console.log('GetCurrentUser fulfilled - state updated:', { user: state.user, isAuthenticated: state.isAuthenticated })
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
