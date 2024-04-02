import { NotificationsConfig } from '../types.js'
import { NotificationHandler } from './notification_handler.js'

export class DefaultHandler extends NotificationHandler {
  boot(config: NotificationsConfig) {
    Object.entries(config.channels).forEach(([key, channel]) => {
      const channelInstance = new channel()
      channelInstance.boot()
      this.channelBindings[key] = channelInstance
    })
  }
}
