import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig } from '../../index.js'
import { ApplicationService } from '@adonisjs/core/types'
import { FakeChannel, FakeHandler } from '../../src/handlers/fake_handler.js'
import { DefaultHandler } from '../../src/handlers/default_handler.js'
import { FakeNotification, notifiable } from '../fake_notifications.js'

const BASE_URL = new URL('./tmp/', import.meta.url)
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, BASE_URL).href)
  }
  return import(filePath)
}

test.group('Notifications Provider', (group) => {
  let app: ApplicationService

  group.setup(() => prepare())

  test('can switch to fake notifications provider', async ({ assert }) => {
    const notifications = await app.container.make('notifications')

    assert.instanceOf(notifications.handler, DefaultHandler)

    notifications.fake()

    assert.instanceOf(notifications.handler, FakeHandler)

    notifications.restore()

    assert.instanceOf(notifications.handler, DefaultHandler)
  })

  test('fake provider assertions work', async () => {
    const notifications = await app.container.make('notifications')
    const fake = notifications.fake()

    fake.assertNotSent(FakeNotification)
    await notifications.sendNotification(notifiable, new FakeNotification())
    fake.assertSent(FakeNotification, 'test')
    fake.assertNotSent(FakeNotification, 'testNotSent')

    fake.clear('testNotSent')
    fake.assertSent(FakeNotification, 'test')

    fake.clear()
    fake.assertNotSent(FakeNotification)
  })

  async function prepare() {
    const ignitor = new IgnitorFactory()
      .merge({
        rcFileContents: {
          providers: [() => import('../../providers/notifications_provider.js')],
        },
      })
      .withCoreConfig()
      .withCoreProviders()
      .merge({
        config: {
          notifications: defineConfig({
            channels: {
              test: FakeChannel,
              testNotSent: FakeChannel,
            },
          }),
        },
      })
      .create(BASE_URL, {
        importer: IMPORTER,
      })

    app = ignitor.createApp('web')
    await app.init()
    await app.boot()
  }
})
