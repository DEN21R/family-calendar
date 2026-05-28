import cron from 'node-cron'
import CalendarTask from '../models/CalendarTask.js'
import Group from '../models/Group.js'
import User from '../models/User.js'
import {
  sendTaskReminderEmail,
  isEmailConfigured,
} from '../services/emailService.js'
import { getReminderDate } from '../utils/taskReminder.js'

async function processTask(task, now) {
  const reminderAt = getReminderDate(task)
  if (!reminderAt) {
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
    { name: 1, email: 1 },
  )

  for (const user of users) {
    if (!user.email) {
      continue
    }

    await sendTaskReminderEmail({
      task,
      group,
      recipient: user,
    })
  }

  task.reminderSentAt = new Date()
  await task.save()
  return true
}

export function startTaskReminderJob() {
  if (!isEmailConfigured()) {
    console.log('Reminder job is disabled: SMTP env is not configured')
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
