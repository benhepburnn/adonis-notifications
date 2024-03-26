import { Notifiable, SmsMessage } from './types.js'

export abstract class Notification {
  notifiable?: Notifiable

  to(notifiable: Notifiable) {
    this.notifiable = notifiable
  }

  via() {
    return ['sms']
  }

  toSms(): SmsMessage {
    throw new Error('Not implemented')
  }
}
