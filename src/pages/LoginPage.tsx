import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { login } from '../store/slices/authSlice'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('LoginPage - Usuário já autenticado, redirecionando para dashboard')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      console.log('Tentando fazer login com:', data)
      const result = await dispatch(login(data)).unwrap()
      console.log('Login realizado com sucesso:', result)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Loteria360
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestão de Lotéricas
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="seu@email.com"
                error={errors.email?.message}
              />
              
              <Input
                {...register('senha')}
                type="password"
                label="Senha"
                placeholder="••••••••"
                error={errors.senha?.message}
              />
              
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
