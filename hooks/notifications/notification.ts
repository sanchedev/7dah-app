import { notificationLists } from '@/lib/notifications/lists'
import { Notifications } from '@/lib/notifications/notifications'
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponse,
  Notification,
} from 'expo-notifications'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { useSignalState } from '../signal'

export function useNotifications() {
  const [notifications] = useSignalState(
    Notifications.notificationsChange,
    Notifications.getNotifications(),
  )

  return notifications
}

export function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notification) {
      const notifications = Notifications.getNotifications()

      const { listId } =
        notifications.find(
          (n) => notification.request.identifier === n.notificationId,
        ) ?? {}

      if (listId == null) return

      const noti = notificationLists.find((n) => n.id === listId)

      if (noti == null) return

      if (typeof noti.path === 'string') {
        // @ts-ignore
        router.push(noti.path)
      }
    }

    const response = getLastNotificationResponse()
    if (response?.notification) {
      redirect(response.notification)
    }

    const subscription = addNotificationResponseReceivedListener((response) => {
      redirect(response.notification)
    })

    return () => {
      subscription.remove()
    }
  }, [])
}
