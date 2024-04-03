import { NotificationChannel } from './channels/notification_channel.js'

export type Constructor<T> = { new (...args: any[]): T }

export type NotificationsConfig = {
  channels: Record<string, Constructor<NotificationChannel>>
}

export type SmsMessage = {
  message: string
  to: string
}

export interface Notifiable {
  notificationGetMobile(): string
  notificationGetEmail(): string
}
