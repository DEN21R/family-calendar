import apiClient from '../api/axios'

function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    'serviceWorker' in navigator &&
    'Notification' in window
  )
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
  if (!isPushSupported()) {
    return {
      supported: false,
      browserSupported: false,
      serverSupported: false,
      pushEnabled: false,
      hasSubscription: false,
      permission: 'denied',
    }
  }

  const { data } = await apiClient.get('/push/me')
  const serverSupported = Boolean(data.pushSupportedOnServer)

  return {
    supported: serverSupported,
    browserSupported: true,
    serverSupported,
    pushEnabled: data.pushEnabled,
    hasSubscription: data.hasSubscription,
    permission: Notification.permission,
  }
}

export async function enablePush() {
  if (!isPushSupported()) {
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
  if (!isPushSupported()) {
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
