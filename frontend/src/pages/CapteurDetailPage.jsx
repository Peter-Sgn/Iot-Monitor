import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCapteur } from '../api/capteursApi'
import { getMesuresHistorique } from '../api/mesuresApi'
import SensorChart from '../components/dashboard/SensorChart'
import MeasuresTable from '../components/dashboard/MeasuresTable'
import { getIconForType } from '../utils/capteurTypeIcons'
import { calculerStatut } from '../utils/statut'
import { IconArrowLeft } from '@tabler/icons-react'

const PERIODES = [
  { label: '24h', heures: 24 },
  { label: '7j', heures: 168 },
  { label: '30j', heures: 720 },
]

export default function CapteurDetailPage() {
  const { capteurId } = useParams()
  const navigate = useNavigate()

  const [capteur, setCapteur] = useState(null)
  const [mesures, setMesures] = useState([])
  const [periode, setPeriode] = useState(PERIODES[0])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCapteur = async () => {
    try {
      const data = await getCapteur(capteurId)
      setCapteur(data)
    } catch (err) {
      setError("Impossible de charger ce capteur.")
    }
  }

  const fetchMesures = async () => {
    const data = await getMesuresHistorique(capteurId, periode.heures)
    setMesures(data)
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([fetchCapteur(), fetchMesures()]).finally(() => setIsLoading(false))
  }, [capteurId])

  useEffect(() => {
    fetchMesures()
  }, [periode])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCapteur()
      fetchMesures()
    }, 10000)
    return () => clearInterval(interval)
  }, [capteurId, periode])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCapteur()
        fetchMesures()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [capteurId, periode])

  if (isLoading) {
    return <p className="text-text-light-secondary dark:text-text-dark-secondary">Chargement...</p>
  }

  if (error || !capteur) {
    return <p className="text-status-danger">{error || 'Capteur introuvable.'}</p>
  }

  const Icon = getIconForType(capteur.type)

  const derniereMesure = mesures[mesures.length - 1]
  const statutDerniereMesure = derniereMesure
    ? calculerStatut(derniereMesure.valeur, capteur.seuil_min, capteur.seuil_max)
    : null

  const lignesTableau = mesures
    .slice()
    .reverse()
    .slice(0, 6)
    .map((m) => ({
      id: m.id,
      horodatage: m.horodatage,
      capteurNom: capteur.nom,
      capteurType: capteur.type,
      valeur: m.valeur,
      unite: capteur.unite,
      statut: calculerStatut(m.valeur, capteur.seuil_min, capteur.seuil_max),
    }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/capteurs')}
            className="flex items-center gap-1.5 text-sm text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary mb-2"
          >
            <IconArrowLeft size={16} />
            Retour aux capteurs
          </button>
          <h1 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary flex items-center gap-2">
            <Icon size={22} className="text-text-light-secondary dark:text-text-dark-secondary" />
            {capteur.nom}
          </h1>
          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
            {capteur.type} • {capteur.localisation || 'Emplacement non défini'}
          </p>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl p-5 shadow-sm max-w-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
            Dernière valeur
          </span>
          {statutDerniereMesure && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              statutDerniereMesure === 'ok'
                ? 'bg-status-success-bg text-status-success'
                : 'bg-status-danger-bg text-status-danger'
            }`}>
              {statutDerniereMesure === 'ok'
                ? 'Normal'
                : statutDerniereMesure === 'alerte_haute'
                  ? 'Alerte haute'
                  : 'Alerte basse'}
            </span>
          )}
        </div>
        <div className="text-3xl font-semibold text-text-light-primary dark:text-text-dark-primary">
          {derniereMesure ? derniereMesure.valeur : '--'}
          <span className="text-base font-normal text-text-light-secondary dark:text-text-dark-secondary ml-1">
            {capteur.unite}
          </span>
        </div>
        <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">
          Seuils : {capteur.seuil_min ?? '--'} / {capteur.seuil_max ?? '--'} {capteur.unite}
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
            Historique des mesures
          </h2>
          <div className="flex gap-1">
            {PERIODES.map((p) => (
              <button
                key={p.label}
                onClick={() => setPeriode(p)}
                className={`px-3 py-1 text-xs rounded-lg ${
                  periode.label === p.label
                    ? 'bg-brand-accent text-white'
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <SensorChart mesures={mesures} unite={capteur.unite} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary mb-3">
          Dernières mesures
        </h2>
        <MeasuresTable lignes={lignesTableau} />
      </div>
    </div>
  )
}