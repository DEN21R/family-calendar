import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

const TASK_COLORS = [
  '#D32F2F',
  '#F57C00',
  '#FBC02D',
  '#388E3C',
  '#00796B',
  '#1976D2',
  '#7B1FA2',
  '#5D4037',
]

const DEFAULT_COLOR = '#1976D2'

const emptyForm = {
  title: '',
  date: '',
  time: '',
  task: '',
  color: DEFAULT_COLOR,
  reminderMinutesBefore: 60,
}

function toInputDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function toInputTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  // Получаем локальное время в формате HH:MM
  return date.toTimeString().slice(0, 5)
}

export default function TaskModal({
  open,
  onClose,
  mode,
  initialTask,
  selectedDate,
  onSubmit,
  onDelete,
  submitting,
}) {
  const initialForm =
    mode === 'edit' && initialTask ?
      {
        title: initialTask.title || '',
        date: toInputDate(initialTask.date),
        time: toInputTime(initialTask.date),
        task: initialTask.task || '',
        color: initialTask.color || DEFAULT_COLOR,
        reminderMinutesBefore: initialTask.reminderMinutesBefore ?? 60,
      }
    : {
        ...emptyForm,
        date: toInputDate(selectedDate),
        time: '',
      }

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('Название задачи обязательно')
      return
    }
    setError('')
    const parsedReminder = Number(form.reminderMinutesBefore)
    await onSubmit({
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      task: form.task,
      color: form.color,
      reminderMinutesBefore:
        Number.isNaN(parsedReminder) || parsedReminder < 0 ?
          60
        : parsedReminder,
    })
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'edit' ? 'Редактирование задачи' : 'Новая задача'}
      </DialogTitle>

      <DialogContent>
        {error ?
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        : null}
        <TextField
          label="Название"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Дата"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Время"
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Описание"
          name="task"
          value={form.task}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
          margin="normal"
        />
        <TextField
          label="Напомнить за (минут)"
          name="reminderMinutesBefore"
          type="number"
          value={form.reminderMinutesBefore}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 10080 }}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Цвет задачи
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {TASK_COLORS.map((color) => {
              const selected = form.color === color
              return (
                <Button
                  key={color}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, color }))}
                  sx={{
                    minWidth: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    p: 0,
                    backgroundColor: color,
                    border: selected ? '3px solid #000000' : '1px solid #ccc',
                    '&:hover': {
                      backgroundColor: color,
                      opacity: 0.9,
                    },
                  }}
                  aria-label={`Выбрать цвет ${color}`}
                />
              )
            })}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {mode === 'edit' ?
          <Button color="error" onClick={onDelete} disabled={submitting}>
            Удалить
          </Button>
        : null}
        <Button onClick={onClose} disabled={submitting}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
