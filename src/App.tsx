import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { Layout } from './components/layout/Layout'
import { AuthRoute } from './components/layout/AuthRoute'
import { AdminRoute, GerenteRoute, VendedorRoute, AuditorRoute } from './components/layout/PermissionRoute'

// Pages
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { VendasPage } from './pages/VendasPage'
import { JogosPage } from './pages/JogosPage'
import { BoloesPage } from './pages/BoloesPage'
import { TurnosPage } from './pages/TurnosPage'
import { RelatoriosPage } from './pages/RelatoriosPage'
import { UsuariosPage } from './pages/UsuariosPage'
import { MovimentosPage } from './pages/MovimentosPage'
import { ClientesPage } from './pages/ClientesPage'

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
                  {/* Rotas acessíveis por todos os perfis autenticados */}
                  <Route path="/vendas" element={<VendasPage />} />
                  <Route path="/clientes" element={<ClientesPage />} />
                  
                  {/* Rotas restritas por perfil */}
                  <Route path="/" element={
                    <AuditorRoute>
                      <DashboardPage />
                    </AuditorRoute>
                  } />
                  
                  <Route path="/analise" element={
                    <AuditorRoute>
                      <AnalysisPage />
                    </AuditorRoute>
                  } />
                  
                  <Route path="/jogos" element={
                    <GerenteRoute>
                      <JogosPage />
                    </GerenteRoute>
                  } />
                  
                  <Route path="/boloes" element={
                    <GerenteRoute>
                      <BoloesPage />
                    </GerenteRoute>
                  } />
                  
                  <Route path="/turnos" element={
                    <GerenteRoute>
                      <TurnosPage />
                    </GerenteRoute>
                  } />
                  
                  <Route path="/movimentos" element={
                    <GerenteRoute>
                      <MovimentosPage />
                    </GerenteRoute>
                  } />
                  
                  <Route path="/relatorios" element={
                    <AuditorRoute>
                      <RelatoriosPage />
                    </AuditorRoute>
                  } />
                  
                  <Route path="/usuarios" element={
                    <AdminRoute>
                      <UsuariosPage />
                    </AdminRoute>
                  } />
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
