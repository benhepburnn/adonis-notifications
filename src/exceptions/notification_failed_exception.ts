import { Exception } from '@adonisjs/core/exceptions'
import { Notification } from '../notification.js'

export class NotificationFailedException extends Exception {
  static status = 500
  notification: Notification
  result: PromiseSettledResult<any>[]

  constructor(notification: Notification<any>, result: PromiseSettledResult<any>[]) {
    super(`Notification failed: ${notification.constructor.name}`)
    this.notification = notification
    this.result = result
  }
}
