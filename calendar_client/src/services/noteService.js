import apiClient from '../api/axios'

export async function getNotes(groupId) {
  const { data } = await apiClient.get(`/groups/${groupId}/notes`)
  return data
}

export async function createNote(groupId, payload) {
  const { data } = await apiClient.post(`/groups/${groupId}/notes`, payload)
  return data
}

export async function updateNote(groupId, noteId, payload) {
  const { data } = await apiClient.put(
    `/groups/${groupId}/notes/${noteId}`,
    payload,
  )
  return data
}

export async function deleteNote(groupId, noteId) {
  const { data } = await apiClient.delete(`/groups/${groupId}/notes/${noteId}`)
  return data
}
