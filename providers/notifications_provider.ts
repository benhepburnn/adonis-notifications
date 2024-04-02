import type { ApplicationService } from '@adonisjs/core/types'
import { NotificationsConfig } from '../src/types.js'
import { NotificationsService } from '../src/notifications_service.js'

export default class NotificationsProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('notifications', async (resolver) => {
      const config = await resolver.make('config')
      const notificationsConfig = config.get('notifications') as NotificationsConfig

      return new NotificationsService(notificationsConfig)
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shut down the app
   */
  async shutdown() {
    const service = await this.app.container.make('notifications')
    service.channels.forEach((channel) => channel.shutdown())
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    notifications: NotificationsService
  }
}
