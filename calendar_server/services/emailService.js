import nodemailer from 'nodemailer'
import { formatDateTimeRu, toTaskDateTime } from '../utils/taskReminder.js'

let transporter

function getTransporter() {
  if (transporter) {
    return transporter
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    return null
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  return transporter
}

export function isEmailConfigured() {
  return Boolean(getTransporter())
}

export async function sendTaskReminderEmail({ task, group, recipient }) {
  const smtp = getTransporter()
  if (!smtp) {
    return { skipped: true, reason: 'SMTP is not configured' }
  }

  const dueAt = toTaskDateTime(task)
  const taskTimeZone = task.timeZone || process.env.DEFAULT_TIME_ZONE
  const eventDateText = formatDateTimeRu(dueAt, taskTimeZone)
  const eventDateWithZone =
    taskTimeZone ? `${eventDateText} (${taskTimeZone})` : eventDateText
  const appUrl = process.env.APP_URL || 'http://localhost:5173'

  const text = [
    `Привет, ${recipient.name || 'участник'}!`,
    '',
    `Напоминание о задаче в группе "${group.name}".`,
    `Задача: ${task.title}`,
    `Когда: ${eventDateWithZone}`,
    task.task ? `Описание: ${task.task}` : '',
    '',
    `Открыть календарь: ${appUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1b1b1f;">
      <h2 style="margin-bottom: 8px;">Напоминание Family Calendar</h2>
      <p>Привет, ${recipient.name || 'участник'}!</p>
      <p>Напоминание о задаче в группе <strong>${group.name}</strong>.</p>
      <p><strong>Задача:</strong> ${task.title}</p>
      <p><strong>Когда:</strong> ${eventDateWithZone}</p>
      ${task.task ? `<p><strong>Описание:</strong> ${task.task}</p>` : ''}
      <p style="margin-top: 20px;">
        <a href="${appUrl}" style="background:#0051f9;color:#fff;padding:10px 14px;text-decoration:none;border-radius:8px;">
          Открыть календарь
        </a>
      </p>
    </div>
  `

  await smtp.sendMail({
    from: process.env.EMAIL_FROM,
    to: recipient.email,
    subject: `Напоминание: ${task.title}`,
    text,
    html,
  })

  return { skipped: false }
}

export async function sendTestEmail({ to, userName }) {
  const smtp = getTransporter()
  if (!smtp) {
    return { skipped: true, reason: 'SMTP is not configured' }
  }

  const appUrl = process.env.APP_URL || 'http://localhost:5173'
  const text = [
    `Привет, ${userName || 'пользователь'}!`,
    '',
    'Это тестовое письмо Family Calendar.',
    'Если ты получил это письмо, SMTP настроен правильно.',
    '',
    `Открыть приложение: ${appUrl}`,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1b1b1f;">
      <h2 style="margin-bottom: 8px;">Тестовое письмо Family Calendar</h2>
      <p>Привет, ${userName || 'пользователь'}!</p>
      <p>Если ты видишь это письмо, SMTP настроен правильно.</p>
      <p style="margin-top: 20px;">
        <a href="${appUrl}" style="background:#0051f9;color:#fff;padding:10px 14px;text-decoration:none;border-radius:8px;">
          Открыть приложение
        </a>
      </p>
    </div>
  `

  await smtp.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Тест SMTP: Family Calendar',
    text,
    html,
  })

  return { skipped: false }
}
