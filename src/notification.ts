import { Notifiable } from './types.js'

export abstract class Notification {
  notifiable?: Notifiable

  to(notifiable: Notifiable) {
    this.notifiable = notifiable
  }

  via(): string[] {
    return []
  }
}
