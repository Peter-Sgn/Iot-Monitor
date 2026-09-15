import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import CapteursManagementPage from './pages/CapteursManagementPage'
import CapteurDetailPage from './pages/CapteurDetailPage'
import AlertesPage from './pages/AlertesPage'
import ParametresPage from './pages/ParametresPage'
import AppLayout from './components/layout/AppLayout'

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/capteurs" element={<CapteursManagementPage />} />
            <Route path="/capteurs/:capteurId" element={<CapteurDetailPage />} />
            <Route path="/alertes" element={<AlertesPage />} />
            <Route path="/parametres" element={<ParametresPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}

export default App