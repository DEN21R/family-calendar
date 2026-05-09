import { Router } from 'express'
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/calendarTaskController.js'

const calendarTaskRouter = Router()

calendarTaskRouter.post('/', createTask)

calendarTaskRouter.get('/', getTasks)

calendarTaskRouter.put('/:id', updateTask)

calendarTaskRouter.delete('/:id', deleteTask)

export default calendarTaskRouter
