import { NotificationsConfig } from './types.js'

export function defineConfig(config: NotificationsConfig): NotificationsConfig {
  return {
    channels: config.channels,
  }
}
