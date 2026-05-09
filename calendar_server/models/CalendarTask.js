import mongoose from 'mongoose'

const calendarTaskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  task: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
})

const CalendarTask = mongoose.model('CalendarTask', calendarTaskSchema)

export default CalendarTask
