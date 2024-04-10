import { Notifiable } from './types.js'

export abstract class Notification {
  protected notifiable?: Notifiable

  to(notifiable: Notifiable) {
    this.notifiable = notifiable
  }

  via(): string[] {
    return []
  }
}
