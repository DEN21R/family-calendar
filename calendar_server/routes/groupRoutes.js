import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import isMember from '../middleware/groupMiddleware.js'
import {
  createGroup,
  getMyGroups,
  getGroupById,
  inviteMember,
  removeMember,
} from '../controllers/groupController.js'

const groupRouter = Router()

groupRouter.use(authMiddleware)

groupRouter.post('/', createGroup)
groupRouter.get('/', getMyGroups)
groupRouter.get('/:id', isMember, getGroupById)
groupRouter.post('/:id/invite', isMember, inviteMember)
groupRouter.delete('/:id/members/:userId', isMember, removeMember)

export default groupRouter
