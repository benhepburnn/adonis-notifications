import { Exception } from '@adonisjs/core/exceptions'

export default class ChannelNotBoundException extends Exception {
  static status = 500

  constructor(channel: string) {
    super(`Channel not bound in config/notifications.ts: ${channel}`)
  }
}
