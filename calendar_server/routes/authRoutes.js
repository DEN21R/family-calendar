import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', authMiddleware, me)

export default authRouter
