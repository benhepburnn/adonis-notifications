import { NotificationChannel } from './channels/notification_channel.js'

type Constructor<T> = { new (): T }

export type NotificationsConfig = {
  channels: Record<string, Constructor<NotificationChannel>>
}

export type SmsMessage = {
  message: string
  to: string
}

export interface Notifiable {
  mobile(): string
  email(): string
}
