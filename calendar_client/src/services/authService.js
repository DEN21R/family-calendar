import apiClient from '../api/axios'

const authService = {
  register: async (name, email, password) => {
    const { data } = await apiClient.post('/auth/register', {
      name,
      email,
      password,
    })
    return data
  },

  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    })
    return data
  },

  me: async () => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },
}

export default authService
