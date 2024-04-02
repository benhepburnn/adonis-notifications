import { NotificationChannel } from './channels/notification_channel.js'
import { Notification } from './notification.js'
import { ChannelNotBoundException, NotificationFailedException } from './exceptions/index.js'
import { Notifiable, NotificationsConfig } from './types.js'
import FakeNotificationsService from './fake_notifications_service.js'
import app from '@adonisjs/core/services/app'

export default class NotificationsService {
  channelBindings: Record<string, NotificationChannel> = {}
  config: NotificationsConfig
  fakeService?: FakeNotificationsService

  constructor(config: NotificationsConfig) {
    this.config = config
    this.boot()
  }

  get channelKeys() {
    return Object.keys(this.channelBindings)
  }

  get channels() {
    return Object.values(this.channelBindings)
  }

  boot() {
    Object.entries(this.config.channels).forEach(([key, channel]) => {
      const channelInstance = new channel()
      channelInstance.boot()
      this.channelBindings[key] = channelInstance
    })
  }

  async sendNotification(to: Notifiable, notification: Notification) {
    notification.to(to)
    const via = notification.via()

    // Validate all via channels are bound
    via.forEach((channelKey) => {
      if (!this.channelKeys.includes(channelKey)) throw new ChannelNotBoundException(channelKey)
    })

    // Start all tasks
    const tasks = via.map(
      async (channelKey) => await this.channelBindings[channelKey].send(notification)
    )

    const result = await Promise.allSettled(tasks)

    if (result.some((promiseResult) => promiseResult.status === 'rejected'))
      throw new NotificationFailedException(notification, result)

    return result
  }

  useFake() {
    if (this instanceof FakeNotificationsService) return

    if (!this.fakeService) this.fakeService = new FakeNotificationsService(this.config)

    app.container.swap(NotificationsService, () => {
      return this.fakeService!
    })
  }

  restore() {
    app.container.restore(NotificationsService)
  }
}
