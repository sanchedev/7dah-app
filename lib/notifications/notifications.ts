import {
  AndroidImportance,
  cancelAllScheduledNotificationsAsync,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  getPermissionsAsync,
  PermissionStatus,
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications'
import { Signal } from '../signal'
import { getNotifications, saveNotifications } from '../storage'
import { notificationLists } from './lists'
import { NotificationInfo } from './types'

type NotificationRef = {
  notificationId: string
  listId: string
}

const notifications: NotificationRef[] = []

export class Notifications {
  static notificationsChange = new Signal<[notifications: NotificationRef[]]>()

  static #change() {
    this.notificationsChange.emit(notifications.slice())
    saveNotifications(notifications)
  }

  static getNotifications() {
    return notifications.slice()
  }

  static async cancelNotification(notificationId: string) {
    await cancelScheduledNotificationAsync(notificationId)
    const index = notifications.findIndex(
      ({ notificationId: n }) => n === notificationId,
    )

    if (index >= 0) {
      notifications.splice(index, 1)
    }
    this.#change()
  }

  static async registryNotification(notification: NotificationInfo) {
    const notif = notifications.find((n) => n.listId === notification.id)

    if (notif != null) {
      await this.cancelNotification(notif.notificationId)
    }

    const permission = await this.#getPermission()

    if (!permission.granted) {
      if (!permission.canAskAgain || !(await this.requestPermissions())) {
        return
      }
    }

    const notificationId = await scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
      },
      trigger: {
        weekday: notification.trigger.weekday,
        hour: notification.trigger.hour,
        minute: notification.trigger.minute,
        type: SchedulableTriggerInputTypes.WEEKLY,
      },
    })
    notifications.push({
      notificationId,
      listId: notification.id,
    })
    this.#change()
  }

  static async requestPermissions() {
    const permissions = await this.#getPermission()

    if (permissions.status === PermissionStatus.GRANTED) return true
    if (!permissions.canAskAgain) return false

    const { status } = await requestPermissionsAsync()

    return status === PermissionStatus.GRANTED
  }

  static async #getPermission() {
    return await getPermissionsAsync()
  }

  static async setup() {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowList: true,
      }),
    })

    await setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.DEFAULT,
    })

    const notifSaved = await getNotifications()
    const allNotif = await getAllScheduledNotificationsAsync()

    notifications.length = 0

    if (
      notifSaved.length < 1 || // no notifications
      allNotif.some(
        (
          n, // some notification not registered
        ) =>
          notifSaved.every(
            ({ notificationId }) => n.identifier !== notificationId,
          ),
      ) ||
      notifSaved.some(
        (
          { listId }, // some notification not exists
        ) => notificationLists.every(({ id }) => listId !== id),
      )
    ) {
      await cancelAllScheduledNotificationsAsync()
      await saveNotifications([])
      for (const n of notificationLists) {
        await this.registryNotification(n)
      }
    } else {
      notifications.push(...notifSaved)
      this.#change()
    }
  }
}
