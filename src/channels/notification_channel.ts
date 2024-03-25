import Notification from '../notification.js'

export default abstract class NotificationChannel {
  boot() {}

  abstract send(notification: Notification): Promise<void>

  shutdown() {}
}
