import axiosClient from './axiosClient'

export const getAlertes = async (statut = null) => {
  const response = await axiosClient.get('/alertes', {
    params: statut ? { statut } : {},
  })
  return response.data
}

export const getAlertesResume = async () => {
  const response = await axiosClient.get('/alertes/resume')
  return response.data
}