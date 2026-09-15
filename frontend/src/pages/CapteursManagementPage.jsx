import { useState, useEffect } from 'react'
import { getCapteurs, createCapteur, updateCapteur, deleteCapteur } from '../api/capteursApi'
import CapteurRow from '../components/capteurs/CapteurRow'
import CapteurFormModal from '../components/capteurs/CapteurFormModal'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import ConfirmDialog from '../components/common/ConfirmDialog'


export default function CapteursManagementPage() {
  const [capteurs, setCapteurs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [capteurEnEdition, setCapteurEnEdition] = useState(null)
  const [capteurASupprimer, setCapteurASupprimer] = useState(null)
  
  const fetchCapteurs = async () => {
    try {
      const data = await getCapteurs()
      setCapteurs(data)
    } catch (err) {
      setError('Impossible de charger les capteurs.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCapteurs()
  }, [])

  const handleCreate = () => {
    setCapteurEnEdition(null)
    setModalOpen(true)
  }

  const handleEdit = (capteur) => {
    setCapteurEnEdition(capteur)
    setModalOpen(true)
  }

  const handleDeleteClick = (capteur) => {
  setCapteurASupprimer(capteur)
}

const confirmDelete = async () => {
  await deleteCapteur(capteurASupprimer.id)
  setCapteurASupprimer(null)
  fetchCapteurs()
}

  const handleSubmit = async (payload) => {
    if (capteurEnEdition) {
      await updateCapteur(capteurEnEdition.id, payload)
    } else {
      await createCapteur(payload)
    }
    setModalOpen(false)
    fetchCapteurs()
  }

  const capteursFiltres = capteurs.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return <p className="text-text-light-secondary dark:text-text-dark-secondary">Chargement...</p>
  }

  if (error) {
    return <p className="text-status-danger">{error}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
            Capteurs
          </h1>
          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
            Gestion et surveillance de tes modules capteurs
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:opacity-90"
        >
          <IconPlus size={16} />
          Nouveau capteur
        </button>
      </div>

      <div className="relative max-w-sm">
        <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un capteur..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary text-sm"
        />
      </div>

      {capteursFiltres.length === 0 ? (
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Aucun capteur trouvé.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {capteursFiltres.map((capteur) => (
            <CapteurRow
              key={capteur.id}
              capteur={capteur}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <CapteurFormModal
          capteur={capteurEnEdition}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {capteurASupprimer && (
        <ConfirmDialog
          title="Supprimer ce capteur ?"
          message={`Le capteur "${capteurASupprimer.nom}" et toutes ses données seront définitivement supprimés. Cette action est irréversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setCapteurASupprimer(null)}
        />
      )}
    </div>
  )
}