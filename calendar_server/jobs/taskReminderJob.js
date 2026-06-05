import cron from 'node-cron'
import CalendarTask from '../models/CalendarTask.js'
import Group from '../models/Group.js'
import User from '../models/User.js'
import {
  sendTaskReminderEmail,
  isEmailConfigured,
} from '../services/emailService.js'
import {
  isPushConfigured,
  sendTaskReminderPush,
} from '../services/pushService.js'
import { getReminderDate, toTaskDateTime } from '../utils/taskReminder.js'

async function processTask(task, now) {
  const reminderAt = getReminderDate(task)
  if (!reminderAt) {
    return false
  }

  const dueAt = toTaskDateTime(task)
  if (dueAt && now > dueAt) {
    task.reminderSentAt = new Date()
    await task.save()
    return false
  }

  if (now < reminderAt) {
    return false
  }

  const group = await Group.findById(task.groupId)
  if (!group) {
    return false
  }

  const users = await User.find(
    { _id: { $in: group.members } },
    { name: 1, email: 1, pushEnabled: 1 },
  )

  let deliveredCount = 0
  let emailFailedCount = 0

  for (const user of users) {
    let userDelivered = false

    if (user.email) {
      try {
        await sendTaskReminderEmail({
          task,
          group,
          recipient: user,
        })
        userDelivered = true
      } catch (error) {
        console.error(
          `Reminder email failed for ${user.email}: ${error.message}`,
        )
        emailFailedCount += 1
      }
    }

    if (user.pushEnabled !== false) {
      try {
        const pushResult = await sendTaskReminderPush({
          task,
          group,
          recipient: user,
        })

        if (pushResult?.sent > 0) {
          userDelivered = true
        }
      } catch (error) {
        console.error(
          `Reminder push failed for user ${user._id}: ${error.message}`,
        )
      }
    }

    if (userDelivered) {
      deliveredCount += 1
    }
  }

  if (emailFailedCount > 0) {
    console.warn(
      `Reminder email partially failed for task ${task._id}: ${emailFailedCount} recipient(s) will be retried`,
    )
    return false
  }

  if (deliveredCount === 0) {
    console.warn(
      `Reminder delivery skipped for task ${task._id}: no successful channels`,
    )
    return false
  }

  task.reminderSentAt = new Date()
  await task.save()
  return true
}

export function startTaskReminderJob() {
  const emailReady = isEmailConfigured()
  const pushReady = isPushConfigured()

  if (!emailReady && !pushReady) {
    console.log('Reminder job is disabled: no delivery channel is configured')
    return null
  }

  const job = cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()

      const candidates = await CalendarTask.find({
        date: { $ne: null },
        reminderSentAt: null,
      })

      let sentCount = 0
      for (const task of candidates) {
        const wasSent = await processTask(task, now)
        if (wasSent) {
          sentCount += 1
        }
      }

      if (sentCount > 0) {
        console.log(`Reminder job: sent ${sentCount} reminder(s)`)
      }
    } catch (error) {
      console.error('Reminder job failed:', error.message)
    }
  })

  console.log('Reminder job started (runs every minute)')
  return job
}
