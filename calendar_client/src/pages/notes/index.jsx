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
import NotesCard from '../../components/card/NotesCard.jsx'

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
  const ideas = useMemo(
    () => notes.filter((note) => note.type === 'idea'),
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
        Планы , идеи и пожелания группы
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
          <MenuItem value="idea">Идея</MenuItem>
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
      <NotesCard
        item={plans}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        title="Планы группы"
      />
      <NotesCard
        item={wishes}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        title="Пожелания на будущее"
      />
      <NotesCard
        item={ideas}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        title="Идеи на будущее"
      />

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
