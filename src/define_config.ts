import { MongooseConfig } from './types.js'

export function defineConfig(config: MongooseConfig): MongooseConfig {
  return {
    mongodb: {
      useDefaultConnection: config.mongodb.useDefaultConnection || true,
      uri: config.mongodb.uri,
      options: config.mongodb.options || {},
    },
  }
}
