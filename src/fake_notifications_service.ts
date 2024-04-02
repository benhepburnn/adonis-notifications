import NotificationsService from './notifications_service.js'
import { Constructor, NotificationsConfig } from './types.js'
import { Notification } from './notification.js'
import { AssertionError } from 'node:assert'
import string from '@adonisjs/core/helpers/string'
import { NotificationChannel } from './channels/notification_channel.js'
import { ChannelNotBoundException } from './exceptions/index.js'

export default class FakeNotificationsService extends NotificationsService {
  constructor(config: NotificationsConfig) {
    super(config)
  }

  get channelKeys() {
    return Object.keys(this.channelBindings)
  }

  get channels() {
    return Object.values(this.channelBindings)
  }

  boot() {
    Object.keys(this.config.channels).forEach((key) => {
      this.channelBindings[key] = new FakeChannel()
    })
  }

  assertSent<T extends Constructor<typeof Notification>>(
    notificationConstructor: T,
    via: string | string[] = []
  ) {
    const viaArray = Array.isArray(via) ? via : [via]

    // Check each specified channel is bound
    viaArray.forEach((viaKey) => {
      if (!this.channelKeys.includes(viaKey)) throw new ChannelNotBoundException(viaKey)
    })

    // Get specified channels, or all channels if none are specified
    const viaChannels = (
      viaArray.length
        ? this.channelKeys
            .filter((key) => viaArray.includes(key))
            .map((key) => this.channelBindings[key])
        : this.channels
    ) as FakeChannel[]

    // For each specified channel, assert notification was sent
    viaChannels.forEach((channel) => {
      channel.assertSent(notificationConstructor)
    })
  }
}

class FakeChannel extends NotificationChannel {
  sent: Notification[] = []

  boot(): void {}
  shutdown(): void {}

  async send(notification: Notification) {
    this.sent.push(notification)
  }

  clear() {
    this.sent = []
  }

  /**
   * Assert the mentioned notification was sent during the fake mode
   */
  assertSent<T extends Constructor<typeof Notification>>(
    notificationConstructor: T,
    findFn?: (notification: InstanceType<T>) => boolean
  ) {
    const matchingNotification = this.sent.find((notification) => {
      if (!findFn) {
        return notification instanceof notificationConstructor
      }
      return (
        notification instanceof notificationConstructor && findFn(notification as InstanceType<T>)
      )
    })

    if (!matchingNotification) {
      throw new AssertionError({
        message: `Expected notification "${notificationConstructor.name}" was not sent`,
      })
    }
  }

  /**
   * Assert the mentioned notification was NOT sent during the fake mode
   */
  assertNotSent<T extends Constructor<typeof Notification>>(
    notificationConstructor: T,
    findFn?: (notification: InstanceType<T>) => boolean
  ) {
    const matchingNotification = this.sent.find((notification) => {
      if (!findFn) {
        return notification instanceof notificationConstructor
      }
      return (
        notification instanceof notificationConstructor && findFn(notification as InstanceType<T>)
      )
    })

    if (matchingNotification) {
      throw new AssertionError({
        message: `Unexpected notification "${notificationConstructor.name}" was sent`,
      })
    }
  }

  /**
   * Assert a total of expected number of notifications were sent
   */
  assertSentCount(count: number): void

  /**
   * Assert the mentioned notification was sent for expected number
   * of times
   */
  assertSentCount(notificationConstructor: Constructor<typeof Notification>, count: number): void
  assertSentCount(
    notificationConstructor: Constructor<typeof Notification> | number,
    count?: number
  ): void {
    if (typeof notificationConstructor === 'number') {
      const actual = this.sent.length
      const expected = notificationConstructor
      if (actual !== expected) {
        throw new AssertionError({
          message: `Expected to send "${expected}" ${string.pluralize(
            'notification',
            expected
          )}, instead received "${actual}" ${string.pluralize('notification', actual)}`,
          actual,
          expected,
        })
      }
      return
    }

    const actual = this.sent.filter(
      (notification) => notification instanceof notificationConstructor
    ).length
    const expected = count as number
    if (actual !== expected) {
      throw new AssertionError({
        message: `Expected "${notificationConstructor.name}" to be sent "${expected}" ${string.pluralize(
          'time',
          expected
        )}, instead it was sent "${actual}" ${string.pluralize('time', actual)}`,
        actual,
        expected,
      })
    }
  }

  /**
   * Assert zero emails were sent
   */
  assertNoneSent() {
    if (this.sent.length) {
      throw new AssertionError({
        message: `Expected zero notifications to be sent, instead received "${this.sent.length}" notifications`,
        expected: [],
        actual: [this.sent.map((mail) => mail.constructor.name)],
      })
    }
  }
}
