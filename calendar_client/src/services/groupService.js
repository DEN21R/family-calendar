import apiClient from '../api/axios'

const groupService = {
  createGroup: async (payload) => {
    const { data } = await apiClient.post('/groups', payload)
    return data
  },

  getMyGroups: async () => {
    const { data } = await apiClient.get('/groups')
    return data
  },

  getGroupById: async (groupId) => {
    const { data } = await apiClient.get(`/groups/${groupId}`)
    return data
  },

  inviteMember: async (groupId, email) => {
    const { data } = await apiClient.post(`/groups/${groupId}/invite`, {
      email,
    })
    return data
  },

  removeMember: async (groupId, userId) => {
    const { data } = await apiClient.delete(
      `/groups/${groupId}/members/${userId}`,
    )
    return data
  },
}

export default groupService
