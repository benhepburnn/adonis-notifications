import { SmsMessage } from './types.js'

export abstract class Notification {
  via() {
    return ['sms']
  }

  toSms(): SmsMessage {
    throw new Error('Not implemented')
  }
}
