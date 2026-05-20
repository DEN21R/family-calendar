import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ruLocale from '@fullcalendar/core/locales/ru'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'

const events = [{ title: 'Meeting', start: new Date() }]

export function Calendar() {
  const { groups, activeGroupId } = useSelector((state) => state.group)
  const activeGroupName =
    groups.find((group) => group._id === activeGroupId)?.name || null

  return (
    <Box>
      <Typography variant="h4">
        {activeGroupName ? `Группа: ${activeGroupName}` : 'Мой календарь'}
      </Typography>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={events}
        eventContent={renderEventContent}
        locales={[ruLocale]}
        locale="ru"
      />
    </Box>
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
