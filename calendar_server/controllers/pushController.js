import PushSubscription from '../models/PushSubscription.js'
import User from '../models/User.js'
import { isPushConfigured } from '../services/pushService.js'

export async function getPushPublicKey(req, res) {
  if (!isPushConfigured()) {
    return res.status(503).json({ error: 'Push is not configured on server' })
  }

  return res.status(200).json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  })
}

export async function getMyPushStatus(req, res) {
  const userId = req.user.id

  const [user, subscriptionCount] = await Promise.all([
    User.findById(userId, { pushEnabled: 1 }),
    PushSubscription.countDocuments({ userId, isActive: true }),
  ])

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.status(200).json({
    pushSupportedOnServer: isPushConfigured(),
    pushEnabled: user.pushEnabled !== false,
    hasSubscription: subscriptionCount > 0,
    subscriptionCount,
  })
}

export async function subscribePush(req, res) {
  try {
    const userId = req.user.id
    const { subscription, userAgent } = req.body

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid push subscription payload' })
    }

    const doc = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        expirationTime: subscription.expirationTime || null,
        userAgent: userAgent || '',
        isActive: true,
      },
      { new: true, upsert: true, runValidators: true },
    )

    return res.status(200).json({
      message: 'Push subscription saved',
      id: doc._id,
    })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to save push subscription' })
  }
}

export async function unsubscribePush(req, res) {
  try {
    const userId = req.user.id
    const { endpoint } = req.body

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' })
    }

    await PushSubscription.findOneAndUpdate(
      { userId, endpoint },
      { isActive: false },
      { new: true },
    )

    return res.status(200).json({ message: 'Push subscription disabled' })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Failed to disable push subscription' })
  }
}

export async function setPushPreferences(req, res) {
  try {
    const userId = req.user.id
    const { pushEnabled } = req.body

    if (typeof pushEnabled !== 'boolean') {
      return res.status(400).json({ error: 'pushEnabled must be boolean' })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { pushEnabled },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({
      message: 'Push preference updated',
      pushEnabled: user.pushEnabled,
    })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update push preference' })
  }
}
