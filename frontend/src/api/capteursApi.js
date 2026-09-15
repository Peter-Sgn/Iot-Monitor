import axiosClient from './axiosClient'

export const getCapteurs = async () => {
  const response = await axiosClient.get('/capteurs')
  return response.data
}

export const getCapteur = async (capteurId) => {
  const response = await axiosClient.get(`/capteurs/${capteurId}`)
  return response.data
}

export const createCapteur = async (capteurData) => {
  const response = await axiosClient.post('/capteurs', capteurData)
  return response.data
}

export const updateCapteur = async (capteurId, updateData) => {
  const response = await axiosClient.put(`/capteurs/${capteurId}`, updateData)
  return response.data
}

export const deleteCapteur = async (capteurId) => {
  await axiosClient.delete(`/capteurs/${capteurId}`)
}