'use strict'

const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../error')
const { logger } = require('../config')

const initRes = (req, res, code = 'OK') => {
  if (HttpStatus[code] === undefined) throw new ErrorHandler(HttpStatus.SERVER_ERROR, 'Invalid response code')
  res.status(HttpStatus[code])
  const username = req.user ? req.user.username : 'unauthorized'
  logger.debug(`Successful ${req.originalUrl} request from ${username}`)
  return {
    path: req.path,
    success: true,
    payload: {}
  }
}

module.exports = {
  initRes
}
