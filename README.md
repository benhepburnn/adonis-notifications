# AdonisJS Notifications

This package creates a notifications service for use in AdonisJS v6 applications.

## Install

Install the package:

```sh
npm install @benhepburn/adonis-notifications
```

or

```sh
pnpm install @benhepburn/adonis-notifications
```

or

```sh
yarn add @benhepburn/adonis-notifications
```

<br />

Then, configure the package for Adonis:

```sh
node ace configure @benhepburn/adonis-notifications
```

## Configuration

Set the channel you wish to use for each notification type in config/notifications.ts.

## Existing channels

* [AWS SNS (currently only SMS)](https://github.com/benhepburnn/adonis-notifications-aws-sns-channel)

# Creating a channel

1. Set up a new AdonisJS package and add @benhepburn/adonis-notifications to the peer and dev dependencies.
2. Create a new class extending *NotificationChannel* and implement required members

Imports:
```ts
import { Notification, NotificationChannel } from '@benhepburn/adonis-notifications'
```
