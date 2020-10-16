'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const redisSecret = crypto.randomBytes(48).toString('hex')

let serverHost, dbHost, redisHost, clientUrl
if (process.env.NODE_ENV === 'production') {
  serverHost = process.env.DIST_SERVER_HOST
  dbHost = process.env.DIST_DB_HOST
  redisHost = process.env.DIST_REDIS_HOST
  clientUrl = `https://${process.env.DIST_SERVER_IP}:${process.env.DIST_SERVER_PORT}`
} else {
  serverHost = process.env.SERVER_HOST
  dbHost = process.env.DB_HOST
  redisHost = process.env.REDIS_HOST
  clientUrl = `http://${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}`
}
const storageBase = process.env.STORAGE_ADDRESS === 'ip'
  ? process.env.STORAGE_IP
  : process.env.STORAGE_HOST

const conf = {
  server: {
    host: serverHost,
    ip: process.env.SERVER_IP,
    port: process.env.SERVER_PORT,
    ssl: {
      key: fs.readFileSync(path.join('.', 'ssl', 'key.txt')),
      cert: fs.readFileSync(path.join('.', 'ssl', 'crt.txt'))
    }
  },
  client: {
    url: clientUrl,
    root: path.join(__dirname, 'usr', 'src', 'app', 'client'),
    static: path.join(__dirname, 'usr', 'src', 'app', 'client', 'static')
  },
  db: {
    url: process.env.DB_CREDENTIALS !== 'no'
      ? `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PWD)}@${dbHost}:${process.env.DB_PORT}/${process.env.DB_NAME}`
      : `mongodb://${dbHost}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    admin: {
      username: process.env.DB_USER,
      password: process.env.DB_PWD
    }
  },
  redis: {
    url: `redis://${redisHost}:${process.env.REDIS_PORT}`,
    secret: redisSecret,
    key: 'vae.connect.sid'
  },
  storage: {
    customPorts: process.env.STORAGE_CUSTOM_PORTS === 'yes',
    url: process.env.STORAGE_CUSTOM_PORTS === 'yes' ? `http://${storageBase}` : `http://${storageBase}:${process.env.STORAGE_PORT}`
  }
}

module.exports = conf
