import { useNavigate } from 'react-router-dom'
import { getIconForType } from '../../utils/capteurTypeIcons'

export default function CapteurRow({ capteur, onEdit, onDelete }) {
  const navigate = useNavigate()
  const Icon = getIconForType(capteur.type)

  return (
    <div className="flex items-center justify-between bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface-light dark:bg-surface-dark flex items-center justify-center">
          <Icon size={20} className="text-text-light-secondary dark:text-text-dark-secondary" />
        </div>
        <div>
          <div className="font-medium text-text-light-primary dark:text-text-dark-primary">
            {capteur.nom}
          </div>
          <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
            ID: {capteur.id} • {capteur.localisation || 'Emplacement non défini'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary uppercase">
            {capteur.type}
          </div>
          <div className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            {capteur.seuil_min ?? '--'} / {capteur.seuil_max ?? '--'} {capteur.unite}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/capteurs/${capteur.id}`)}
            className="px-3 py-1.5 text-xs rounded-lg border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark"
          >
            Voir les détails
          </button>
          <button
            onClick={() => onEdit(capteur)}
            className="px-3 py-1.5 text-xs rounded-lg border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(capteur)}
            className="px-3 py-1.5 text-xs rounded-lg border border-status-danger/30 text-status-danger hover:bg-status-danger-bg"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}