import { Notification } from '../notification.js'

export abstract class NotificationChannel {
  boot() {}

  abstract send(notification: Notification<any>): Promise<any>

  shutdown() {}
}
