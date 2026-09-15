export const calculerStatut = (valeur, seuilMin, seuilMax) => {
  if (seuilMin !== null && seuilMin !== undefined && valeur < seuilMin) {
    return 'alerte_basse'
  }
  if (seuilMax !== null && seuilMax !== undefined && valeur > seuilMax) {
    return 'alerte_haute'
  }
  return 'ok'
}