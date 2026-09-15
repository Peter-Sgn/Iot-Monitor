import { getIconForType } from '../../utils/capteurTypeIcons'

const statutConfig = {
  ok: { label: 'Normal', badgeBg: 'bg-status-success-bg', badgeText: 'text-status-success' },
  alerte_haute: { label: 'Alerte haute', badgeBg: 'bg-status-danger-bg', badgeText: 'text-status-danger' },
  alerte_basse: { label: 'Alerte basse', badgeBg: 'bg-status-danger-bg', badgeText: 'text-status-danger' },
  aucune_donnee: { label: 'Aucune donnée', badgeBg: 'bg-surface-light dark:bg-surface-dark', badgeText: 'text-text-light-secondary dark:text-text-dark-secondary' },
}

export default function SensorCard({ capteur, isSelected, onClick }) {
  const Icon = getIconForType(capteur.type)
  const statut = statutConfig[capteur.statut] || statutConfig.aucune_donnee
  const isAlerte = capteur.statut === 'alerte_haute' || capteur.statut === 'alerte_basse'

  return (
    <button
      onClick={onClick}
      className={`text-left bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm transition-all ${
        isSelected ? 'ring-2 ring-brand-accent' : ''
      } ${isAlerte ? 'ring-1 ring-status-danger' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
          {capteur.nom}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statut.badgeBg} ${statut.badgeText}`}>
          {statut.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Icon size={20} className="text-text-light-secondary dark:text-text-dark-secondary" />
        <span className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary">
          {capteur.derniere_valeur !== null ? capteur.derniere_valeur : '--'}
          <span className="text-sm font-normal text-text-light-secondary dark:text-text-dark-secondary ml-1">
            {capteur.unite}
          </span>
        </span>
      </div>
    </button>
  )
}