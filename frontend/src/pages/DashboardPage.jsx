import { useState, useEffect } from 'react'
import { getDashboardResume } from '../api/mesuresApi'
import { getMesuresHistorique } from '../api/mesuresApi'
import SensorCard from '../components/dashboard/SensorCard'
import SensorChart from '../components/dashboard/SensorChart'
import MeasuresTable from '../components/dashboard/MeasuresTable'
import { calculerStatut } from '../utils/statut'

export default function DashboardPage() {
  const [capteurs, setCapteurs] = useState([])
  const [selectedCapteurId, setSelectedCapteurId] = useState(null)
  const [mesures, setMesures] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)


  const fetchResume = async () => {
    try {
      const data = await getDashboardResume()
      setCapteurs(data)
      setSelectedCapteurId((current) => current ?? (data.length > 0 ? data[0].capteur_id : null))
    } catch (err) {
      setError('Impossible de charger le dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMesures = async () => {
    if (!selectedCapteurId) return
    const data = await getMesuresHistorique(selectedCapteurId, 24)
    setMesures(data)
  }

  useEffect(() => {
    fetchResume()
    const interval = setInterval(fetchResume, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchMesures()
    const interval = setInterval(fetchMesures, 10000)
    return () => clearInterval(interval)
  }, [selectedCapteurId])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchResume()
        fetchMesures()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [selectedCapteurId])

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getDashboardResume()
        setCapteurs(data)
        setSelectedCapteurId((current) => current ?? (data.length > 0 ? data[0].capteur_id : null))
      } catch (err) {
        setError('Impossible de charger le dashboard.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResume()
    const interval = setInterval(fetchResume, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {

    if (!selectedCapteurId) return

    const fetchMesures = async () => {
      const data = await getMesuresHistorique(selectedCapteurId, 24)
      setMesures(data)
    }

    fetchMesures()
    const interval = setInterval(fetchMesures, 10000)

    return () => clearInterval(interval)
  }, [selectedCapteurId])

  useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      fetchResume()
      if (selectedCapteurId) fetchMesures()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [selectedCapteurId])

  const selectedCapteur = capteurs.find((c) => c.capteur_id === selectedCapteurId)

  const lignesTableau = mesures
  .slice()
  .reverse()
  .slice(0, 6)
  .map((m) => ({
    id: m.id,
    horodatage: m.horodatage,
    capteurNom: selectedCapteur?.nom || '',
    capteurType: selectedCapteur?.type || '',
    valeur: m.valeur,
    unite: selectedCapteur?.unite || '',
    statut: calculerStatut(m.valeur, selectedCapteur?.seuil_min, selectedCapteur?.seuil_max),
  }))

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
          Dashboard
        </h1>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
          Surveillance en temps réel de tes capteurs
        </p>
      </div>

      {capteurs.length === 0 ? (
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Aucun capteur pour l'instant.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capteurs.map((capteur) => (
              <SensorCard
                key={capteur.capteur_id}
                capteur={capteur}
                isSelected={capteur.capteur_id === selectedCapteurId}
                onClick={() => setSelectedCapteurId(capteur.capteur_id)}
              />
            ))}
          </div>

          <div className="bg-card-light dark:bg-card-dark rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
              Historique — {selectedCapteur?.nom} (24h)
            </h2>
            <SensorChart mesures={mesures} unite={selectedCapteur?.unite} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary mb-3">
              Dernières mesures
            </h2>
            <MeasuresTable lignes={lignesTableau} />
          </div>
        </>
      )}
    </div>
  )
}