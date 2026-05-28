import apiClient from '../api/axios'

export async function getUpcomingReminders(limit = 5) {
  const { data } = await apiClient.get('/groups/reminders/upcoming', {
    params: { limit },
  })
  return data
}
