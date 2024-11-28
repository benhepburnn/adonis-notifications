import { Notification } from './notification.js'
import { Notifiable, NotificationsConfig } from './types.js'
import { NotificationHandler } from './handlers/notification_handler.js'
import { DefaultHandler } from './handlers/default_handler.js'
import { FakeHandler } from './handlers/fake_handler.js'

export class NotificationsService {
  config: NotificationsConfig
  handler: NotificationHandler

  constructor(config: NotificationsConfig) {
    this.config = config
    this.handler = new DefaultHandler(config)
  }

  async sendNotification<NotifiableType = Notifiable>(
    to: NotifiableType,
    notification: Notification<NotifiableType>
  ) {
    notification.to(to)
    return this.handler.send(notification)
  }

  async sendBulkNotification<NotifiableType = Notifiable>(
    to: NotifiableType[],
    notification: Notification<NotifiableType>
  ) {
    return this.handler.sendBulk(notification, to)
  }

  fake() {
    this.handler = new FakeHandler(this.config)
    return this.handler as FakeHandler
  }

  restore() {
    this.handler = new DefaultHandler(this.config)
  }
}
