export function toTaskDateTime(task) {
  if (!task?.date) {
    return null
  }

  const datePart = new Date(task.date).toISOString().slice(0, 10)
  const normalizedTime =
    typeof task.time === 'string' && task.time.trim() ?
      task.time.trim()
    : '09:00'

  const dueAt = new Date(`${datePart}T${normalizedTime}:00`)
  if (Number.isNaN(dueAt.getTime())) {
    return null
  }

  return dueAt
}

export function getReminderDate(task) {
  const dueAt = toTaskDateTime(task)
  if (!dueAt) {
    return null
  }

  const minutes =
    (
      typeof task.reminderMinutesBefore === 'number' &&
      task.reminderMinutesBefore >= 0
    ) ?
      task.reminderMinutesBefore
    : 60

  return new Date(dueAt.getTime() - minutes * 60 * 1000)
}

export function formatDateTimeRu(date) {
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
