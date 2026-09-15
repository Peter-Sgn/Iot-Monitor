export default function AuthIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-40 h-32 mx-auto">
      <circle cx="100" cy="80" r="70" className="fill-white/10" />
      <circle cx="100" cy="80" r="45" className="fill-white/15" />
      <circle cx="70" cy="55" r="6" className="fill-white" />
      <circle cx="130" cy="55" r="6" className="fill-white" />
      <circle cx="100" cy="105" r="6" className="fill-white" />
      <line x1="70" y1="55" x2="100" y2="105" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="130" y1="55" x2="100" y2="105" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="70" y1="55" x2="130" y2="55" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  )
}