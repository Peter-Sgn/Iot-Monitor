export default function ConfirmDialog({ title, message, onConfirm, onCancel, isDangerous = true }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-2">
          {title}
        </h2>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white ${
              isDangerous ? 'bg-status-danger hover:opacity-90' : 'bg-brand-accent hover:opacity-90'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}