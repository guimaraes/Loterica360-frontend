import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { Layout } from './components/layout/Layout'
import { AuthRoute } from './components/layout/AuthRoute'

// Pages
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { VendasPage } from './pages/VendasPage'
import { BoloesPage } from './pages/BoloesPage'
import { TurnosPage } from './pages/TurnosPage'
import { RelatoriosPage } from './pages/RelatoriosPage'
import { UsuariosPage } from './pages/UsuariosPage'
import { MovimentosPage } from './pages/MovimentosPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <AuthRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/vendas" element={<VendasPage />} />
                  <Route path="/boloes" element={<BoloesPage />} />
                  <Route path="/turnos" element={<TurnosPage />} />
                  <Route path="/movimentos" element={<MovimentosPage />} />
                  <Route path="/relatorios" element={<RelatoriosPage />} />
                  <Route path="/usuarios" element={<UsuariosPage />} />
                </Routes>
              </Layout>
            </AuthRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
