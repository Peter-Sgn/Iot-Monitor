import { getIconForType } from '../../utils/capteurTypeIcons'
import { formatDateTime } from '../../utils/formatDate'

const statutLabels = {
  ok: { label: 'Normal', badgeBg: 'bg-status-success-bg', badgeText: 'text-status-success' },
  alerte_haute: { label: 'Alerte haute', badgeBg: 'bg-status-danger-bg', badgeText: 'text-status-danger' },
  alerte_basse: { label: 'Alerte basse', badgeBg: 'bg-status-danger-bg', badgeText: 'text-status-danger' },
}

export default function MeasuresTable({ lignes }) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-light dark:bg-surface-dark">
            <th className="text-left px-4 py-2.5 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Date &amp; heure
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Capteur
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Valeur
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => {
            const Icon = getIconForType(ligne.capteurType)
            const statut = statutLabels[ligne.statut] || statutLabels.ok
            return (
              <tr key={ligne.id} className="border-t border-border-light dark:border-border-dark">
                <td className="px-4 py-2.5 text-text-light-secondary dark:text-text-dark-secondary">
                  {formatDateTime(ligne.horodatage)}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-surface-light dark:bg-surface-dark flex items-center justify-center">
                      <Icon size={15} className="text-text-light-secondary dark:text-text-dark-secondary" />
                    </div>
                    <div>
                      <div className="text-text-light-primary dark:text-text-dark-primary font-medium">
                        {ligne.capteurNom}
                      </div>
                      <div className="text-text-light-secondary dark:text-text-dark-secondary text-xs capitalize">
                        {ligne.capteurType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-medium text-text-light-primary dark:text-text-dark-primary">
                  {ligne.valeur} {ligne.unite}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statut.badgeBg} ${statut.badgeText}`}>
                    {statut.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}