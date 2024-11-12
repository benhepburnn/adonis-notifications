import { Notifiable } from './types.js'

export abstract class Notification<NotifiableType = Notifiable> {
  notifiable?: NotifiableType

  to(notifiable: NotifiableType) {
    this.notifiable = notifiable
  }

  via(): string[] {
    return []
  }
}
