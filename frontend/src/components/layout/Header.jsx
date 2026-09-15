import { useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <header className="flex items-center justify-end gap-4 px-6 py-4 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
      <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success"></span>
        </span>
        Système en ligne
      </div>

      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-lg border border-border-light dark:border-border-dark flex items-center justify-center text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark"
        aria-label="Changer de thème"
      >
        {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </button>
    </header>
  )
}