import { NavLink } from 'react-router-dom'
import {useAuth} from '../../auth/AuthContext'
import {
  IconLayoutDashboard,
  IconActivity,
  IconBell,
  IconSettings,
  IconCpu,
  IconLogout,
} from '@tabler/icons-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { to: '/capteurs', label: 'Capteurs', icon: IconActivity },
  { to: '/alertes', label: 'Alertes', icon: IconBell },
  { to: '/parametres', label: 'Paramètres', icon: IconSettings },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-[220px] flex-shrink-0 bg-sidebar-bg flex flex-col py-5 px-3">
      <div className="flex items-center gap-2 px-2 pb-8">
        <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
          <IconCpu size={18} className="text-white" />
        </div>
        <span className="text-sidebar-text-active font-semibold text-base">IoT Monitor</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-active-bg text-sidebar-text-active font-medium'
                    : 'text-sidebar-text hover:bg-sidebar-active-bg/60 hover:text-sidebar-text-active'
                }`
              }
            >
              <Icon size={18} stroke={1.8} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-text hover:bg-sidebar-active-bg/60 hover:text-sidebar-text-active transition-colors"
      >
        <IconLogout size={18} stroke={1.8} />
        Déconnexion
      </button>
    </aside>
  )
}