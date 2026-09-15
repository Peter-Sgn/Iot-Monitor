import { getIconForType } from '../../utils/capteurTypeIcons'
import { formatDateTime } from '../../utils/formatDate'
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react'

export default function AlerteCard({ alerte }) {
  const isResolue = alerte.statut === 'resolue'
  const Icon = getIconForType(alerte.capteur_type || '')

  return (
    <div className="flex items-center justify-between bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          isResolue ? 'bg-status-success-bg' : 'bg-status-danger-bg'
        }`}>
          {isResolue ? (
            <IconCheck size={18} className="text-status-success" />
          ) : (
            <IconAlertTriangle size={18} className="text-status-danger" />
          )}
        </div>
        <div>
          <div className="font-medium text-text-light-primary dark:text-text-dark-primary text-sm">
            {alerte.type === 'haute' ? 'Valeur trop élevée' : 'Valeur trop basse'}
          </div>
          <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
            {alerte.capteur_nom || `Capteur #${alerte.capteur_id}`} — mesure à {alerte.valeur_mesuree}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
          {formatDateTime(alerte.declenchee_le)}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          isResolue
            ? 'bg-status-success-bg text-status-success'
            : 'bg-status-danger-bg text-status-danger'
        }`}>
          {isResolue ? 'Résolu' : 'Active'}
        </span>
      </div>
    </div>
  )
}