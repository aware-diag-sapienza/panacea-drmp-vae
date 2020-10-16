'use strict'

const logger = require('./logger')

const memory = () => {
  const totalAllocated = process.memoryUsage().rss
  const totalUsed = process.memoryUsage().heapUsed
  logger.debug(`Memory allocated: ${Math.round(totalAllocated / 1024 / 1024 * 100) / 100} MB`)
  logger.debug(`Memory used: ${Math.round(totalUsed / 1024 / 1024 * 100) / 100} MB`)
}

module.exports = {
  memory
}
