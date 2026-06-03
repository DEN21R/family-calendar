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

      // Always keep user inside this PWA origin.
      if (parsed.origin !== appOrigin) {
        return new URL(
          `${parsed.pathname}${parsed.search}${parsed.hash}`,
          appOrigin,
        ).toString()
      }

      return parsed.toString()
    } catch {
      return new URL('/calendar', base).toString()
    }
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            const targetUrl = toAppUrl(client.url || appOrigin, targetUrlRaw)
            return client
              .navigate(targetUrl)
              .then(() => client.focus())
              .catch(() => client.focus())
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(toAppUrl(appOrigin, targetUrlRaw))
        }

        return null
      }),
  )
})
