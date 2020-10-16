'use strict'

const winston = require('winston')

const date = new Date()
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: `logs/${date.toISOString()}-error.log`,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `logs/${date.toISOString()}-combined.log`
    })
  ]
})

module.exports = logger
