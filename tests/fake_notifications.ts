import { Notification } from '../src/notification.js'
import { Notifiable } from '../src/types.js'

export class FakeNotification extends Notification {
  via(): string[] {
    return ['test']
  }

  toTest() {
    return {
      message: 'test notification',
    }
  }
}

export const notifiable: Notifiable = {
  notificationGetMobile: () => '+61412345678',
  notificationGetEmail: () => 'test@test.com',
}
