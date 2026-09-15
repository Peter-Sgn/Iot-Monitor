import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SensorChart({ mesures, unite }) {
  const MAX_POINTS = 50

  const echantillonnees = mesures.length > MAX_POINTS
    ? mesures.filter((_, index) => index % Math.ceil(mesures.length / MAX_POINTS) === 0)
    : mesures

  const data = echantillonnees.map((m) => ({
    heure: new Date(m.horodatage).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    valeur: m.valeur,
  }))

  if (data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-text-light-secondary dark:text-text-dark-secondary">
        Aucune mesure sur cette période.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
        <XAxis
          dataKey="heure"
          tick={{ fontSize: 11 }}
          stroke="var(--color-text-light-secondary)"
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-light-secondary)" width={50} />
        <Tooltip formatter={(value) => [`${value} ${unite}`, 'Valeur']} />
        <Line type="monotone" dataKey="valeur" stroke="var(--color-brand-accent)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}