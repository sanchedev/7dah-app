import { NotificationInfo, Weekday } from './types'

export const notificationLists: NotificationInfo[] = [
  {
    id: 'welcome-saturday',
    title: 'Ya se oculta el Sol...',
    body: '¡Qué tal si recibimos el Sábado Juntos!',
    path: '/hymns/h535',
    trigger: {
      weekday: Weekday.FRIDAY,
      hour: 6,
      minute: 30,
    },
  },
]
