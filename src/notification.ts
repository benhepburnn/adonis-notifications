import { Notifiable } from './types.js'

export abstract class Notification<NotifiableType = Notifiable> {
  notifiable?: NotifiableType | NotifiableType[]

  to(notifiable: NotifiableType | NotifiableType[]) {
    this.notifiable = notifiable
  }

  via(): string[] {
    return []
  }
}
