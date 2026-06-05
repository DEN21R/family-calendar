import nodemailer from 'nodemailer'
import { formatDateTimeRu, toTaskDateTime } from '../utils/taskReminder.js'

let transporter

function getEmailDiagnosticConfig() {
  const enabled = String(process.env.EMAIL_DIAGNOSTIC_MODE || '').toLowerCase() === 'true'
  const bcc = process.env.EMAIL_DIAGNOSTIC_BCC || ''
  const subjectPrefix = process.env.EMAIL_DIAGNOSTIC_SUBJECT_PREFIX || '[DIAG]'

  return {
    enabled,
    bcc,
    subjectPrefix,
  }
}

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

  const diagnostic = getEmailDiagnosticConfig()

  const dueAt = toTaskDateTime(task)
  const taskTimeZone = task.timeZone || process.env.DEFAULT_TIME_ZONE
  const eventDateText = formatDateTimeRu(dueAt, taskTimeZone)
  const eventDateWithZone =
    taskTimeZone ? `${eventDateText} (${taskTimeZone})` : eventDateText
  const appBaseUrl = process.env.APP_URL || 'http://localhost:5173'
  const appUrl = new URL('/calendar', appBaseUrl)
  if (task?.groupId) {
    appUrl.searchParams.set('groupId', String(task.groupId))
  }

  const text = [
    `Привет, ${recipient.name || 'участник'}!`,
    '',
    `Напоминание о задаче в группе "${group.name}".`,
    `Задача: ${task.title}`,
    `Когда: ${eventDateWithZone}`,
    task.task ? `Описание: ${task.task}` : '',
    '',
    `Открыть календарь: ${appUrl.toString()}`,
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
        <a href="${appUrl.toString()}" style="background:#0051f9;color:#fff;padding:10px 14px;text-decoration:none;border-radius:8px;">
          Открыть календарь
        </a>
      </p>
    </div>
  `

  const info = await smtp.sendMail({
    from: process.env.EMAIL_FROM,
    to: recipient.email,
    bcc: diagnostic.bcc || undefined,
    subject:
      diagnostic.enabled ?
        `${diagnostic.subjectPrefix} Напоминание: ${task.title}`
      : `Напоминание: ${task.title}`,
    text,
    html: diagnostic.enabled ? undefined : html,
  })

  const accepted = Array.isArray(info?.accepted) ? info.accepted : []
  const rejected = Array.isArray(info?.rejected) ? info.rejected : []
  const recipientLower = String(recipient.email || '').toLowerCase()
  const hasAcceptedRecipient = accepted.some(
    (address) => String(address || '').toLowerCase() === recipientLower,
  )

  if (!hasAcceptedRecipient || rejected.length > 0) {
    const response = info?.response ? ` response=${info.response}` : ''
    throw new Error(
      `SMTP did not accept recipient ${recipient.email}; accepted=${accepted.join(',') || '-'} rejected=${rejected.join(',') || '-'}${response}`,
    )
  }

  return { skipped: false }
}

export async function sendTestEmail({ to, userName }) {
  const smtp = getTransporter()
  if (!smtp) {
    return { skipped: true, reason: 'SMTP is not configured' }
  }

  const diagnostic = getEmailDiagnosticConfig()

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

  const info = await smtp.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    bcc: diagnostic.bcc || undefined,
    subject:
      diagnostic.enabled ?
        `${diagnostic.subjectPrefix} Тест SMTP: Family Calendar`
      : 'Тест SMTP: Family Calendar',
    text,
    html: diagnostic.enabled ? undefined : html,
  })

  const accepted = Array.isArray(info?.accepted) ? info.accepted : []
  const rejected = Array.isArray(info?.rejected) ? info.rejected : []
  const toLower = String(to || '').toLowerCase()
  const hasAcceptedRecipient = accepted.some(
    (address) => String(address || '').toLowerCase() === toLower,
  )

  if (!hasAcceptedRecipient || rejected.length > 0) {
    const response = info?.response ? ` response=${info.response}` : ''
    throw new Error(
      `SMTP test email was not accepted for ${to}; accepted=${accepted.join(',') || '-'} rejected=${rejected.join(',') || '-'}${response}`,
    )
  }

  return { skipped: false }
}
