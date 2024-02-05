import { Secret } from "@adonisjs/core/helpers";
import { ConnectOptions } from "mongoose";

export type MongoDbConfig = {
  useDefaultConnection: boolean;
  uri: Secret<string>;
  options: ConnectOptions
}

export type MongooseConfig = {
  mongodb: MongoDbConfig;
}
