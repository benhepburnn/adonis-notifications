import { Exception } from '@adonisjs/core/exceptions'
import { Notification } from '../notification.js'

export class NotificationFailedException extends Exception {
  static status = 500
  notification: Notification<any>
  result: PromiseSettledResult<any>[]
  resultString: string

  constructor(
    notification: Notification<any>,
    result: PromiseSettledResult<any>[],
    resultString: string
  ) {
    super(`Notification failed: ${notification.constructor.name}`)
    this.notification = notification
    this.result = result
    this.resultString = resultString
  }
}
