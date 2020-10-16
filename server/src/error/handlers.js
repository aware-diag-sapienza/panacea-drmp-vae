'use strict'

const HttpStatus = require('http-status-codes')

const { logger } = require('../config')

const sendError = (err, _req, res, _next) => {
  const code = err.statusCode !== undefined ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR
  const status = HttpStatus.getStatusText(code)
  const message = err.message !== undefined ? err.message : 'Internal server error'
  logger.debug(`Error ${code} ${status} - ${message}`)
  res.json({
    success: false,
    error: {
      code,
      status,
      message
    }
  })
}

module.exports = { sendError }
