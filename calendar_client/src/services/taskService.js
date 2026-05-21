import apiClient from '../api/axios'

export async function getTasks(groupId) {
  const { data } = await apiClient.get(`/groups/${groupId}/tasks`)
  return data
}

// Backward-compatible alias.
export const getTask = getTasks

export async function createTask(groupId, payload) {
  const { data } = await apiClient.post(`/groups/${groupId}/tasks`, payload)
  return data
}

export async function updateTask(groupId, taskId, payload) {
  const { data } = await apiClient.put(
    `/groups/${groupId}/tasks/${taskId}`,
    payload,
  )
  return data
}

export async function deleteTask(groupId, taskId) {
  const { data } = await apiClient.delete(`/groups/${groupId}/tasks/${taskId}`)
  return data
}
