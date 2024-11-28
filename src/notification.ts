import { Notifiable } from './types.js'

export abstract class Notification<NotifiableType = Notifiable> {
  notifiable?: NotifiableType[]

  to(notifiable: NotifiableType | NotifiableType[]) {
    this.notifiable = Array.isArray(notifiable) ? notifiable : [notifiable]
  }

  via(): string[] {
    return []
  }
}
