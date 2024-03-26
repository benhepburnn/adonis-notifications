import { Notification } from '../notification.js'

export abstract class NotificationChannel {
  boot() {}

  abstract send(notification: Notification): Promise<void>

  shutdown() {}
}
