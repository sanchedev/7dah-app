export interface NotificationInfo {
  id: string
  title: string
  body: string
  trigger: NotificationInfoTrigger
  path: string
}

export interface NotificationInfoTrigger {
  weekday: Weekday
  hour: number
  minute: number
}

export enum Weekday {
  SUNDAY = 1,
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
}
