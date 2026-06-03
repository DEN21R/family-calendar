import apiClient from '../api/axios'

function isIosDevice() {
  return /iPad|iPhone|iPod/i.test(navigator.userAgent)
}

function isStandaloneDisplayMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function getLocalPushSupportInfo() {
  if (typeof window === 'undefined') {
    return { supported: false, reason: 'no_window' }
  }

  if (!window.isSecureContext) {
    return { supported: false, reason: 'not_secure_context' }
  }

  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'no_service_worker' }
  }

  if (!('Notification' in window)) {
    return { supported: false, reason: 'no_notification_api' }
  }

  if (isIosDevice() && !isStandaloneDisplayMode()) {
    return { supported: false, reason: 'ios_not_standalone' }
  }

  return { supported: true, reason: null }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

async function getServiceWorkerRegistration() {
  return navigator.serviceWorker.register('/sw.js')
}

export async function getPushStatus() {
  const local = getLocalPushSupportInfo()
  if (!local.supported) {
    return {
      supported: false,
      browserSupported: false,
      serverSupported: false,
      reason: local.reason,
      pushEnabled: false,
      hasSubscription: false,
      permission: 'denied',
    }
  }

  const { data } = await apiClient.get('/push/me')
  const serverSupported = Boolean(data.pushSupportedOnServer)
  const registration = await getServiceWorkerRegistration()
  const localSubscription = await registration.pushManager?.getSubscription()
  const hasLocalSubscription = Boolean(localSubscription)

  return {
    supported: serverSupported,
    browserSupported: true,
    serverSupported,
    reason: null,
    pushEnabled: data.pushEnabled,
    hasSubscription: hasLocalSubscription,
    hasAnySubscription: Boolean(data.hasSubscription),
    permission: Notification.permission,
  }
}

export async function enablePush() {
  const local = getLocalPushSupportInfo()
  if (!local.supported) {
    throw new Error('Push is not supported in this browser')
  }

  const { data: keyData } = await apiClient.get('/push/public-key')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Permission denied for push notifications')
  }

  const registration = await getServiceWorkerRegistration()
  if (!registration.pushManager) {
    throw new Error('PushManager is unavailable in this browser context')
  }

  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
    })
  }

  await apiClient.post('/push/subscriptions', {
    subscription,
    userAgent: navigator.userAgent,
  })

  await apiClient.put('/push/preferences', { pushEnabled: true })
}

export async function disablePush() {
  const local = getLocalPushSupportInfo()
  if (!local.supported) {
    return
  }

  const registration = await navigator.serviceWorker.getRegistration('/sw.js')
  const subscription = await registration?.pushManager.getSubscription()

  if (subscription) {
    await apiClient.delete('/push/subscriptions', {
      data: { endpoint: subscription.endpoint },
    })
    await subscription.unsubscribe()
  }

  await apiClient.put('/push/preferences', { pushEnabled: false })
}
