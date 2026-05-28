function toLocalDatePart(value) {
  if (!value) return null

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function toTaskDateTime(task) {
  if (!task?.date) {
    return null
  }

  const datePart = toLocalDatePart(task.date)
  if (!datePart) {
    return null
  }

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
