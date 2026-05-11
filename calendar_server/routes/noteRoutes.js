import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import isMember from '../middleware/groupMiddleware.js'
import {
  createNote,
  getNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js'

const noteRouter = Router()

noteRouter.use(authMiddleware)

noteRouter.get('/:groupId/notes', isMember, getNote)
noteRouter.post('/:groupId/notes', isMember, createNote)
noteRouter.put('/:groupId/notes/:id', isMember, updateNote)
noteRouter.delete('/:groupId/notes/:id', isMember, deleteNote)

export default noteRouter
