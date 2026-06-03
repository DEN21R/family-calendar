import webpush from 'web-push'
import PushSubscription from '../models/PushSubscription.js'

let vapidInitialized = false

function getPushConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT

  return {
    publicKey,
    privateKey,
    subject,
  }
}

function ensureVapid() {
  if (vapidInitialized) {
    return true
  }

  const { publicKey, privateKey, subject } = getPushConfig()
  if (!publicKey || !privateKey || !subject) {
    return false
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  vapidInitialized = true
  return true
}

export function isPushConfigured() {
  return ensureVapid()
}

function buildTaskUrl(task) {
  const appBaseUrl = process.env.APP_URL || 'http://localhost:5173'
  const url = new URL('/calendar', appBaseUrl)

  if (task?.groupId) {
    url.searchParams.set('groupId', String(task.groupId))
  }

  return url.toString()
}

export async function sendTaskReminderPush({ task, group, recipient }) {
  if (!ensureVapid()) {
    return { sent: 0, skipped: true, reason: 'VAPID is not configured' }
  }

  const subscriptions = await PushSubscription.find({
    userId: recipient._id,
    isActive: true,
  })

  if (!subscriptions.length) {
    return { sent: 0, skipped: true, reason: 'No active subscriptions' }
  }

  const payload = JSON.stringify({
    title: `Напоминание: ${task.title}`,
    body: `${group.name} • Скоро событие`,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `task-${task._id}`,
    url: buildTaskUrl(task),
  })

  let sent = 0

  for (const item of subscriptions) {
    const subscription = {
      endpoint: item.endpoint,
      expirationTime: item.expirationTime,
      keys: {
        p256dh: item.p256dh,
        auth: item.auth,
      },
    }

    try {
      await webpush.sendNotification(subscription, payload)
      item.lastSuccessAt = new Date()
      item.lastFailureAt = null
      item.failureCount = 0
      await item.save()
      sent += 1
    } catch (error) {
      const statusCode = error?.statusCode
      item.lastFailureAt = new Date()
      item.failureCount += 1

      if (statusCode === 404 || statusCode === 410) {
        item.isActive = false
      }

      await item.save()
    }
  }

  return { sent, skipped: false }
}
