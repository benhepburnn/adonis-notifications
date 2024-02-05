import type { ApplicationService } from '@adonisjs/core/types'
import mongoose, { Connection } from "mongoose";
import logger from "@adonisjs/core/services/logger";
import env from '#start/env';
import { MongooseConfig } from "../src/types.js";

export default class MongooseProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    const conn = this.createConnection();

    // Disable strict query to prevent Node.js warning
    conn.set("strictQuery", false);

    // Build returned data
    const m = { ...mongoose.default, ...conn, connection: conn };

    // Register mongoose
    this.app.container.singleton("mongoose", () => m);
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
    const conn: Connection = (await this.app.container.make(
      "mongoose",
    )).connection;
    try {
      await conn.asPromise();
      logger.debug('Connected to MongoDB');
    } catch(err) {
      logger.error(`MongoDb Error: ${err}`);
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    await (await this.app.container.make("mongoose")).disconnect();
  }

  /**
   * Create mongoose connection
   */
  private createConnection(): Connection {
    const mongoConfig = this.app.config.get('mongoose') as MongooseConfig;

    // Register bindings
    const useDefault = !mongoConfig.mongodb.useDefaultConnection;
    const mongoUri = mongoConfig.mongodb.uri;
    const mongoOptions = mongoConfig.mongodb.options;

    if (useDefault) {
      mongoose.connect(mongoUri.toString(), mongoOptions);

      return mongoose.connection;
    } else {
      return mongoose.createConnection(mongoUri.toString(), mongoOptions);
    }
  }
}
