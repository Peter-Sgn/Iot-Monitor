import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { register as registerApi } from '../api/authApi'
import AuthSidePanel from '../components/auth/AuthSidePanel'
import { IconCpu } from '@tabler/icons-react'

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [mode, setMode] = useState(location.pathname === '/register' ? 'register' : 'login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerError, setRegisterError] = useState(null)
  const [registerSubmitting, setRegisterSubmitting] = useState(false)

  const switchTo = (nextMode) => {
    setMode(nextMode)
    navigate(`/${nextMode}`, { replace: true })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginError(null)
    setLoginSubmitting(true)
    try {
      await login(loginEmail, loginPassword)
      navigate('/dashboard')
    } catch (err) {
      setLoginError('Email ou mot de passe incorrect.')
    } finally {
      setLoginSubmitting(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setRegisterError(null)
    setRegisterSubmitting(true)
    try {
      await registerApi(registerEmail, registerPassword)
      await login(registerEmail, registerPassword)
      navigate('/dashboard')
    } catch (err) {
      setRegisterError("Impossible de créer le compte. Cet email est peut-être déjà utilisé.")
    } finally {
      setRegisterSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 rounded-md bg-brand-accent flex items-center justify-center">
            <IconCpu size={18} className="text-white" />
          </div>
          <span className="text-text-light-primary dark:text-text-dark-primary font-semibold text-lg">
            IoT Monitor
          </span>
        </div>

        <div className="relative w-full h-[480px] rounded-xl overflow-hidden shadow-lg">
          <div
            className="flex w-[200%] h-full transition-transform duration-500 ease-in-out"
            style={{ transform: mode === 'login' ? 'translateX(0%)' : 'translateX(-50%)' }}
          >
            {/* Page 1 : mode login */}
            <div className="flex w-1/2 h-full">
              <div className="w-1/2 flex-shrink-0 bg-card-light dark:bg-card-dark flex flex-col justify-center px-10">
                <h1 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
                  Connexion
                </h1>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  Accède à ton tableau de bord
                </p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  {loginError && <p className="text-sm text-status-danger">{loginError}</p>}
                  <button
                    type="submit"
                    disabled={loginSubmitting}
                    className="mt-2 w-full py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {loginSubmitting ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>
              </div>
              <AuthSidePanel
                title="Vous n'avez pas encore de compte ? Inscrivez-vous ici."
                buttonLabel="S'inscrire"
                onButtonClick={() => switchTo('register')}
              />
            </div>

            {/* Page 2 : mode register */}
            <div className="flex w-1/2 h-full">
              <AuthSidePanel
                title="Connectez-vous pour accéder à votre compte."
                buttonLabel="Se connecter"
                onButtonClick={() => switchTo('login')}
              />
              <div className="w-1/2 flex-shrink-0 bg-card-light dark:bg-card-dark flex flex-col justify-center px-10">
                <h1 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
                  Créer un compte
                </h1>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  Rejoins IoT Monitor en quelques secondes
                </p>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  {registerError && <p className="text-sm text-status-danger">{registerError}</p>}
                  <button
                    type="submit"
                    disabled={registerSubmitting}
                    className="mt-2 w-full py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {registerSubmitting ? 'Création...' : "S'inscrire"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}