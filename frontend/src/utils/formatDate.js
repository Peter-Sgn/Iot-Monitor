export const formatDateTime = (isoString) => {
  const utcString = isoString.endsWith('Z') ? isoString : `${isoString}Z`
  const date = new Date(utcString)
  const today = new Date()

  const isToday = date.toDateString() === today.toDateString()
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  if (isToday) {
    return `Aujourd'hui, ${time}`
  }
  return `${date.toLocaleDateString('fr-FR')}, ${time}`
}