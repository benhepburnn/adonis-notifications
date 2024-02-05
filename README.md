# AdonisJS Mongoose

This package creates a Mongoose service for use in AdonisJS applications.

## Install

Install mongoose from npm:
```sh
npm install mongoose
```
or
```sh
pnpm install mongoose
```
or
```sh
yarn add mongoose
```
<br />

Then, install the package:
```sh
npm install @benhepburn/adonis-mongoose
```
or
```sh
pnpm install @benhepburn/adonis-mongoose
```
or
```sh
yarn add @benhepburn/adonis-mongoose
```
<br />

Finally, configure the package for Adonis:
```sh
node ace configure @benhepburn/adonis-mongoose
```

## Configuration

Edit config/mongoose.ts as needed, then add the MongoDB connection URI to your .env file:
```dotenv
MONGODB_URI=mongodb://...
```
