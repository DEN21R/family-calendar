import mongoose from 'mongoose'

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

const calendarTaskSchema = mongoose.Schema(
  {
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
    color: {
      type: String,
      enum: TASK_COLORS,
      default: '#1976D2',
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
)

const CalendarTask = mongoose.model('CalendarTask', calendarTaskSchema)

export default CalendarTask
