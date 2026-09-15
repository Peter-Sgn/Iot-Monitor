import axiosClient from './axiosClient'

export const register = (email, password) => {
  return axiosClient.post('/auth/register', { email, password })
}

export const login = async (email, password) => {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await axiosClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  localStorage.setItem('access_token', response.data.access_token)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('access_token')
}