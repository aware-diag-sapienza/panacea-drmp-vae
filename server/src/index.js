'use strict'

const { logger } = require('./config')
const server = require('./server')

server.listen()

function handleStop (signal) {
  logger.debug(`Received ${signal}`)
  server.close()
  process.exit(0)
}

process.on('SIGINT', handleStop)
process.on('SIGTERM', handleStop)
