import { NotificationChannel } from './channels/notification_channel.js'

export type Constructor<T> = { new (...args: any[]): T }

export type NotificationsConfig = {
  channels: Record<string, Constructor<NotificationChannel>>
}

export interface NotifiableMobile {
  notificationGetMobile(): string
}

export interface NotifiableEmail {
  notificationGetEmail(): string
}

export type Notifiable = NotifiableMobile & NotifiableEmail
