self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  const data = event.data.json()
  const title = data.title || 'Family Calendar'
  const options = {
    body: data.body || '',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    tag: data.tag || 'family-calendar-reminder',
    data: {
      url: data.url || '/calendar',
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrlRaw = event.notification.data?.url || '/calendar'
  const appOrigin = self.location.origin

  function toAppUrl(base, target) {
    try {
      const parsed = new URL(target, base)
      return new URL(
        `${parsed.pathname}${parsed.search}${parsed.hash}`,
        appOrigin,
      ).toString()
    } catch {
      return new URL('/calendar', appOrigin).toString()
    }
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            const targetUrl = toAppUrl(client.url || appOrigin, targetUrlRaw)
            client.navigate(targetUrl)
            return client.focus()
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(toAppUrl(appOrigin, targetUrlRaw))
        }

        return null
      }),
  )
})
