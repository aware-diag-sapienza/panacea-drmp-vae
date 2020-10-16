'use strict'

const conf = require('./conf')
const logger = require('./logger')
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const RedisClient = redis.createClient(conf.redis.url)

const options = {
  client: RedisClient
}
const redisStore = new RedisStore(options)

RedisClient.on('error', (err) => logger.debug('Redis error: ' + err))

RedisClient.on('ready', () => logger.debug('Redis connected'))

const init = (app) => {
  app.use(session({
    store: redisStore,
    key: conf.redis.key,
    secret: conf.redis.secret,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  }))
}

module.exports = {
  init,
  redisStore
}
