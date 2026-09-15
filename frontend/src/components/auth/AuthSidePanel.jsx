import AuthIllustration from './AuthIllustration'

export default function AuthSidePanel({ title, buttonLabel, onButtonClick }) {
  return (
    <div className="w-1/2 flex-shrink-0 bg-brand-accent flex flex-col items-center justify-center text-center px-8 py-10">
      <AuthIllustration />
      <p className="text-white text-sm mt-4 mb-8 max-w-[220px]">
        {title}
      </p>
      <button
        onClick={onButtonClick}
        className="mt-auto px-6 py-2 rounded-lg border border-white text-white text-sm font-medium hover:bg-white hover:text-brand-accent transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  )
}