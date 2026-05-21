import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../../services/noteService'

const emptyForm = {
  title: '',
  content: '',
  type: 'plan',
}

function Notes() {
  const { activeGroupId } = useSelector((state) => state.group)
  const navigate = useNavigate()

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [snack, setSnack] = useState('')

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (!activeGroupId) return

    let cancelled = false

    async function loadNotes() {
      try {
        setLoading(true)
        setError('')
        const data = await getNotes(activeGroupId)
        const list = Array.isArray(data?.notes) ? data.notes : []
        if (!cancelled) {
          const sorted = [...list].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )
          setNotes(sorted)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.error || 'Не удалось загрузить заметки')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNotes()

    return () => {
      cancelled = true
    }
  }, [activeGroupId])

  const plans = useMemo(
    () => notes.filter((note) => (note.type || 'plan') === 'plan'),
    [notes],
  )
  const wishes = useMemo(
    () => notes.filter((note) => note.type === 'wish'),
    [notes],
  )

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSave() {
    if (!activeGroupId) return
    if (!form.title.trim()) {
      setError('Введите заголовок заметки')
      return
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      content: form.content.trim(),
    }

    setError('')

    if (editingId) {
      const data = await updateNote(activeGroupId, editingId, payload)
      if (data?.note) {
        setNotes((prev) =>
          prev.map((note) => (note._id === editingId ? data.note : note)),
        )
      }
      setSnack('Заметка обновлена')
      resetForm()
      return
    }

    const data = await createNote(activeGroupId, payload)
    const created = data?.note || data
    if (created) {
      setNotes((prev) => [created, ...prev])
      setSnack('Заметка добавлена')
      resetForm()
    }
  }

  async function handleDelete(noteId) {
    if (!activeGroupId) return
    const confirmed = window.confirm('Удалить заметку?')
    if (!confirmed) return

    await deleteNote(activeGroupId, noteId)
    setNotes((prev) => prev.filter((note) => note._id !== noteId))
    if (editingId === noteId) resetForm()
    setSnack('Заметка удалена')
  }

  function handleEdit(note) {
    setEditingId(note._id)
    setForm({
      title: note.title || '',
      content: note.content || '',
      type: note.type || 'plan',
    })
  }

  if (!activeGroupId) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info">Сначала выберите или создайте группу</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/groups/create')}
        >
          Создать группу
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Планы и пожелания группы
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
        Здесь хранится общее видение семьи: планы, идеи, пожелания на будущее.
      </Typography>

      {loading ?
        <CircularProgress />
      : null}
      {error ?
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      : null}

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Заголовок"
          value={form.title}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          fullWidth
        />

        <Select
          value={form.type}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, type: event.target.value }))
          }
        >
          <MenuItem value="plan">План</MenuItem>
          <MenuItem value="wish">Пожелание</MenuItem>
        </Select>

        <TextField
          label="Описание"
          value={form.content}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, content: event.target.value }))
          }
          multiline
          minRows={4}
          fullWidth
        />

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Сохранить изменения' : 'Добавить заметку'}
          </Button>
          <Button onClick={resetForm}>Очистить</Button>
        </Stack>
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Планы группы
      </Typography>
      <Stack spacing={1} sx={{ mb: 3 }}>
        {plans.map((note) => (
          <Card key={note._id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="subtitle1">{note.title}</Typography>
                <Chip size="small" label="План" color="primary" />
              </Stack>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {note.content}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => handleEdit(note)}>
                  Редактировать
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(note._id)}
                >
                  Удалить
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Пожелания на будущее
      </Typography>
      <Stack spacing={1}>
        {wishes.map((note) => (
          <Card key={note._id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="subtitle1">{note.title}</Typography>
                <Chip size="small" label="Пожелание" color="secondary" />
              </Stack>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {note.content}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => handleEdit(note)}>
                  Редактировать
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(note._id)}
                >
                  Удалить
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2500}
        onClose={() => setSnack('')}
        message={snack}
      />
    </Box>
  )
}

export default Notes
