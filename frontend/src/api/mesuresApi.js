import axiosClient from './axiosClient'

export const getMesuresHistorique = async (capteurId, depuisHeures = 24) => {
  const response = await axiosClient.get(`/capteurs/${capteurId}/mesures`, {
    params: { depuis_heures: depuisHeures },
  })
  return response.data
}

export const getDashboardResume = async () => {
  const response = await axiosClient.get('/dashboard/resume')
  return response.data
}