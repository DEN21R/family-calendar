import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import isMember from '../middleware/groupMiddleware.js'
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getUpcomingReminders,
} from '../controllers/calendarTaskController.js'

const calendarTaskRouter = Router()

calendarTaskRouter.use(authMiddleware)

calendarTaskRouter.get('/reminders/upcoming', getUpcomingReminders)

calendarTaskRouter.get('/:groupId/tasks', isMember, getTasks)

calendarTaskRouter.post('/:groupId/tasks', isMember, createTask)

calendarTaskRouter.put('/:groupId/tasks/:id', isMember, updateTask)

calendarTaskRouter.delete('/:groupId/tasks/:id', isMember, deleteTask)

export default calendarTaskRouter
