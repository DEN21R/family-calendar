import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ruLocale from '@fullcalendar/core/locales/ru'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Alert } from '@mui/material'

const events = [{ title: 'Meeting', start: new Date() }]

export function Calendar() {
  const { activeGroupId } = useSelector((state) => state.group)
  const navigate = useNavigate()

  if (!activeGroupId) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info">Сначала выберите или создайте группу</Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/groups/create')}
          sx={{ mt: 2 }}
        >
          Создать группу
        </Button>
      </Box>
    )
  }

  return (
    <div>
      <h1>Наши задания</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={events}
        eventContent={renderEventContent}
        locales={[ruLocale]}
        locale="ru"
      />
    </div>
  )
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
