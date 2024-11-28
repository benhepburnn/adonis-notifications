import { Notification } from '../notification.js'

export abstract class NotificationChannel {
  boot() {}

  abstract send(notification: Notification<any>): Promise<any>

  abstract sendBulk<NotifiableType>(
    notification: Notification<NotifiableType>,
    to: NotifiableType[]
  ): Promise<any>

  shutdown() {}
}
