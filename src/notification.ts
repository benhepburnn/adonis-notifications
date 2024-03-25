import { SmsMessage } from './types.js'

export default abstract class Notification {
  via() {
    return ['sms']
  }

  toSms(): SmsMessage {
    throw new Error('Not implemented')
  }
}
