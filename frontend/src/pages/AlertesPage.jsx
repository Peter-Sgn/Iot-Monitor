import { useState, useEffect } from 'react'
import { getAlertes, getAlertesResume } from '../api/alertesApi'
import AlerteCard from '../components/alertes/AlerteCard'

const FILTRES = [
  { label: 'Toutes', value: null },
  { label: 'Actives', value: 'active' },
  { label: 'Résolues', value: 'resolue' },
]

export default function AlertesPage() {
  const [alertes, setAlertes] = useState([])
  const [resume, setResume] = useState({ actives: 0, aujourdhui: 0, total_30_jours: 0 })
  const [filtre, setFiltre] = useState(FILTRES[0])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAlertes = async () => {
    try {
      const [alertesData, resumeData] = await Promise.all([
        getAlertes(filtre.value),
        getAlertesResume(),
      ])
      setAlertes(alertesData)
      setResume(resumeData)
    } catch (err) {
      setError('Impossible de charger les alertes.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlertes()
    const interval = setInterval(fetchAlertes, 10000)
    return () => clearInterval(interval)
  }, [filtre])

  if (isLoading) {
    return <p className="text-text-light-secondary dark:text-text-dark-secondary">Chargement...</p>
  }

  if (error) {
    return <p className="text-status-danger">{error}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
          Alertes
        </h1>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
          Historique et gestion des anomalies de tes capteurs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm">
          <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Alertes actives</div>
          <div className="text-2xl font-semibold text-status-danger mt-1">{resume.actives} active{resume.actives > 1 ? 's' : ''}</div>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm">
          <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Alertes aujourd'hui</div>
          <div className="text-2xl font-semibold text-status-warning mt-1">{resume.aujourdhui} alerte{resume.aujourdhui > 1 ? 's' : ''}</div>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm">
          <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Total (30 jours)</div>
          <div className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary mt-1">{resume.total_30_jours} enregistrées</div>
        </div>
      </div>

      <div className="flex gap-1">
        {FILTRES.map((f) => (
          <button
            key={f.label}
            onClick={() => setFiltre(f)}
            className={`px-4 py-1.5 text-sm rounded-lg ${
              filtre.label === f.label
                ? 'bg-brand-accent text-white'
                : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {alertes.length === 0 ? (
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Aucune alerte {filtre.value === 'active' ? 'active' : filtre.value === 'resolue' ? 'résolue' : ''} pour l'instant.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {alertes.map((alerte) => (
            <AlerteCard key={alerte.id} alerte={alerte} />
          ))}
        </div>
      )}
    </div>
  )
}