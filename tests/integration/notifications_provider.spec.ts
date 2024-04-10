import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig } from '../../index.js'
import { NotificationsService } from '../../src/notifications_service.js'
import { ApplicationService } from '@adonisjs/core/types'
import { FakeChannel } from '../../src/handlers/fake_handler.js'

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

  test('register notifications provider', async ({ assert }) => {
    assert.instanceOf(await app.container.make('notifications'), NotificationsService)
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
