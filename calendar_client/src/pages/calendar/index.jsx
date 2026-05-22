import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import TaskModal from '../../components/TaskModal'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../services/taskService'
import styles from './styles.module.css'

const DEFAULT_TASK_COLOR = '#1976D2'

function mapTaskToEvent(task) {
  const normalizedDate =
    task?.date ? new Date(task.date).toISOString().slice(0, 10) : ''
  const hasTime = Boolean(task.time)
  const start = hasTime ? `${normalizedDate}T${task.time}` : normalizedDate
  return {
    id: task._id,
    title: task.title,
    start,
    textColor: task.color || DEFAULT_TASK_COLOR,
    extendedProps: {
      task,
    },
  }
}

export function Calendar() {
  const { groups, activeGroupId } = useSelector((state) => state.group)
  const activeGroupName =
    groups.find((group) => group._id === activeGroupId)?.name || null
  const [tasks, setTasks] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')

  const [selectedDate, setSelectedDate] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const events = useMemo(
    () => (activeGroupId ? tasks : []),
    [activeGroupId, tasks],
  )

  useEffect(() => {
    if (!activeGroupId) {
      return
    }

    async function loadTasks() {
      try {
        const data = await getTasks(activeGroupId)
        const list = Array.isArray(data?.tasks) ? data.tasks : []
        setTasks(list.map(mapTaskToEvent))
      } catch {
        setTasks([])
      }
    }

    loadTasks()
  }, [activeGroupId])

  function handleDateClick(info) {
    setSelectedDate(info.dateStr)
    setEditingTask(null)
    setModalMode('create')
    setModalOpen(true)
  }

  function handleEventClick(info) {
    setEditingTask(info.event.extendedProps.task)
    setSelectedDate('')
    setModalMode('edit')
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditingTask(null)
    setSelectedDate('')
  }

  async function handleSubmit(payload) {
    if (!activeGroupId) return

    setSubmitting(true)
    try {
      if (modalMode === 'create') {
        const data = await createTask(activeGroupId, payload)
        if (data?.task) {
          setTasks((prev) => [...prev, mapTaskToEvent(data.task)])
        }
      } else if (editingTask?._id) {
        const data = await updateTask(activeGroupId, editingTask._id, payload)
        if (data?.task) {
          setTasks((prev) =>
            prev.map((event) =>
              event.id === editingTask._id ? mapTaskToEvent(data.task) : event,
            ),
          )
        }
      }
      handleModalClose()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!activeGroupId || !editingTask?._id) return

    setSubmitting(true)
    try {
      await deleteTask(activeGroupId, editingTask._id)
      setTasks((prev) => prev.filter((event) => event.id !== editingTask._id))
      handleModalClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {activeGroupName ? `Группа: ${activeGroupName}` : 'Мой календарь'}
      </Typography>
      <Box className={styles.wrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={false}
          events={events}
          eventContent={renderEventContent}
          locales={[ruLocale]}
          locale="ru"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </Box>
      <TaskModal
        key={`${modalMode}-${editingTask?._id || selectedDate || 'new'}`}
        open={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        initialTask={editingTask}
        selectedDate={selectedDate}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitting={submitting}
      />
    </Box>
  )
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i style={{ color: eventInfo.event.textColor || DEFAULT_TASK_COLOR }}>
        {eventInfo.event.title}
      </i>
    </>
  )
}
