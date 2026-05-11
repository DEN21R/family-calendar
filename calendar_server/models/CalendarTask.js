import mongoose from 'mongoose'

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
