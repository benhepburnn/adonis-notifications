import { NotificationChannel } from '../channels/notification_channel.js'
import { Notification } from '../notification.js'
import { Notifiable, NotificationsConfig } from '../types.js'
import { ChannelNotBoundException, NotificationFailedException } from '../exceptions/index.js'

export abstract class NotificationHandler {
  channelBindings: Record<string, NotificationChannel> = {}

  get channelKeys() {
    return Object.keys(this.channelBindings)
  }

  get channels() {
    return Object.values(this.channelBindings)
  }

  constructor(config: NotificationsConfig) {
    this.boot(config)
  }

  abstract boot(config: NotificationsConfig): void

  async send<NotifiableType = Notifiable>(
    notification: Notification<NotifiableType>
  ): Promise<PromiseSettledResult<any>[]> {
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

  async sendBulk<NotifiableType = Notifiable>(
    notification: Notification<NotifiableType>,
    to: NotifiableType[]
  ): Promise<PromiseSettledResult<any>[]> {
    const via = notification.via()

    // Validate all via channels are bound
    via.forEach((channelKey) => {
      if (!this.channelKeys.includes(channelKey)) throw new ChannelNotBoundException(channelKey)
    })

    // Start all tasks
    const tasks = via.map(
      async (channelKey) => await this.channelBindings[channelKey].sendBulk(notification, to)
    )

    const result = await Promise.allSettled(tasks)

    if (result.some((promiseResult) => promiseResult.status === 'rejected'))
      throw new NotificationFailedException(notification, result)

    return result
  }
}
