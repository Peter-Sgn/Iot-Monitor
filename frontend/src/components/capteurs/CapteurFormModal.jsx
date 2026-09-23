import { useState, useEffect } from 'react'

const TYPES_DISPONIBLES = ['temperature', 'humidite', 'luminosite']

export default function CapteurFormModal({ capteur, onClose, onSubmit }) {
  const isEditing = !!capteur

  const [nom, setNom] = useState(capteur?.nom || '')
  const [type, setType] = useState(capteur?.type || TYPES_DISPONIBLES[0])
  const [unite, setUnite] = useState(capteur?.unite || '')
  const [localisation, setLocalisation] = useState(capteur?.localisation || '')
  const [seuilMin, setSeuilMin] = useState(capteur?.seuil_min ?? '')
  const [seuilMax, setSeuilMax] = useState(capteur?.seuil_max ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const payload = {
      nom,
      type,
      unite,
      localisation: localisation || null,
      seuil_min: seuilMin === '' ? null : parseFloat(seuilMin),
      seuil_max: seuilMax === '' ? null : parseFloat(seuilMax),
    }

    await onSubmit(payload)
    setIsSubmitting(false)
  }

  const UNITES_PAR_TYPE = {
  temperature: ['°C'],
  humidite: ['%'],
  luminosite: ['lux'],
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
          {isEditing ? 'Modifier le capteur' : 'Nouveau capteur'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">
              Nom
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm"
            >
              {TYPES_DISPONIBLES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">
              Unité
            </label>
            <select
              value={unite}
              onChange={(e) => setUnite(e.target.value)}
            >
              <option value="">Aucune</option>
              {UNITES_PAR_TYPE[type].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">
              Emplacement
            </label>
            <input
              type="text"
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">
                Seuil min
              </label>
              <input
                type="number"
                step="any"
                value={seuilMin}
                onChange={(e) => setSeuilMin(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">
                Seuil max
              </label>
              <input
                type="number"
                step="any"
                value={seuilMax}
                onChange={(e) => setSeuilMax(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-light-primary dark:text-text-dark-primary text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm rounded-lg bg-brand-accent text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}