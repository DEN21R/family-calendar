import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getMyPushStatus,
  getPushPublicKey,
  setPushPreferences,
  subscribePush,
  unsubscribePush,
} from '../controllers/pushController.js'

const pushRouter = Router()

pushRouter.use(authMiddleware)

pushRouter.get('/public-key', getPushPublicKey)
pushRouter.get('/me', getMyPushStatus)
pushRouter.post('/subscriptions', subscribePush)
pushRouter.delete('/subscriptions', unsubscribePush)
pushRouter.put('/preferences', setPushPreferences)

export default pushRouter
