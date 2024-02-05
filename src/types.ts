import { ConnectOptions } from 'mongoose'

export type MongoDbConfig = {
  useDefaultConnection: boolean
  uri: string
  options: ConnectOptions
}

export type MongooseConfig = {
  mongodb: MongoDbConfig
  syncIndexesOnStart: boolean
}
