import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import { useSelector } from 'react-redux'
import { Box, Typography, Button, Avatar } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import TaskModal from '../../components/TaskModal'

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../services/taskService'
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom'
import { getGroupAvatarIcon } from '../../utils/groupAvatar'

const DEFAULT_TASK_COLOR = '#1976D2'


function mapTaskToEvent(task) {
  // Используем только поле date (ISO-строка)
  return {
    id: task._id,
    title: task.title,
    start: task.date,
    textColor: task.color || DEFAULT_TASK_COLOR,
    extendedProps: {
      task,
    },
  }
}

export function Calendar() {
  const { groups, activeGroupId } = useSelector((state) => state.group)
  const activeGroup =
    groups.find((group) => group._id === activeGroupId) || null
  const activeGroupName = activeGroup?.name || null
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
  const navigate = useNavigate()

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
      // Фикс: объединяем дату и время в локальное Date и конвертируем в UTC ISO
      let fixedPayload = { ...payload }
      if (payload.date && payload.time) {
        const localDateTime = new Date(`${payload.date}T${payload.time}`)
        fixedPayload.date = localDateTime.toISOString() // UTC
        delete fixedPayload.time
      }
      if (modalMode === 'create') {
        const data = await createTask(activeGroupId, fixedPayload)
        if (data?.task) {
          setTasks((prev) => [...prev, mapTaskToEvent(data.task)])
        }
      } else if (editingTask?._id) {
        const data = await updateTask(
          activeGroupId,
          editingTask._id,
          fixedPayload,
        )
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeGroup && (
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: activeGroup.color || '#1976D2',
              }}
            >
              {(() => {
                const Icon = getGroupAvatarIcon(activeGroup.avatarKey)
                return <Icon sx={{ fontSize: 18 }} />
              })()}
            </Avatar>
          )}
          <Typography
            color="primary"
            sx={{
              fontWeight: 500,
              fontSize: {
                xs: '16px',
                sm: '20px',
                md: '28px',
              },
            }}
          >
            {activeGroupName ? `Группа: ${activeGroupName}` : 'Мой календарь'}
          </Typography>
        </Box>
        {activeGroupId && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/groups/${activeGroupId}/settings`)}
            sx={{
              borderColor: '#20419c',
              color: '#20419c',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { borderColor: '#17327c', color: '#17327c' },
            }}
          >
            Настройки группы
          </Button>
        )}
      </Box>
      <Box className={styles.wrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
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
