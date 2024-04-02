import app from '@adonisjs/core/services/app'
import { NotificationsService } from '../src/notifications_service.js'

let notifications: NotificationsService

/**
 * Returns a singleton instance of the NotificationsService class from the
 * container.
 */
await app.booted(async () => {
  notifications = await app.container.make('notifications')
})

export { notifications as default }
