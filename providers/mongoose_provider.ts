import type { ApplicationService } from '@adonisjs/core/types'
import mongoose, { Connection } from 'mongoose'
import { MongooseConfig } from '../src/types.js'

export default class MongooseProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    const conn = this.createConnection()

    // Disable strict query to prevent Node.js warning
    conn.set('strictQuery', false)

    // Build returned data
    const m = { ...mongoose.default, ...conn, connection: conn }

    // Register mongoose
    this.app.container.singleton('mongoose', () => m)
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    // Connect to MongoDb
    const mongooseService = await this.app.container.make('mongoose')
    const conn: Connection = mongooseService.connection
    const logger = await this.app.container.make('logger')
    const config = this.app.config.get('mongoose') as MongooseConfig
    try {
      await conn.asPromise()
      if (config.syncIndexesOnStart) await conn.syncIndexes()
    } catch (err) {
      logger.error(`MongoDb Error: ${err}`)
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    const mongooseService = await this.app.container.make('mongoose')
    await mongooseService.disconnect()
  }

  /**
   * Create mongoose connection
   */
  private createConnection(): Connection {
    const mongoConfig = this.app.config.get('mongoose') as MongooseConfig

    // Register bindings
    const useDefault = mongoConfig.mongodb.useDefaultConnection
    const mongoUri = mongoConfig.mongodb.uri
    const mongoOptions = mongoConfig.mongodb.options

    if (useDefault) {
      mongoose.connect(mongoUri, mongoOptions)

      return mongoose.connection
    } else {
      return mongoose.createConnection(mongoUri, mongoOptions)
    }
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    mongoose: typeof mongoose
  }
}
