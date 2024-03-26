import { NotificationChannel } from './channels/notification_channel.js'
import { Notification } from './notification.js'
import ChannelNotBoundException from './exceptions/channel_not_bound_exception.js'
import { Notifiable, NotificationsConfig } from './types.js'

export default class NotificationsService {
  channelBindings: Record<string, NotificationChannel> = {}
  config: NotificationsConfig

  constructor(config: NotificationsConfig) {
    this.config = config
    this.configure()
  }

  get channelKeys() {
    return Object.keys(this.channelBindings)
  }

  get channels() {
    return Object.values(this.channelBindings)
  }

  private configure() {
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

    return Promise.allSettled(tasks)
  }
}
