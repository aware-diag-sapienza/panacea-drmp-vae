'use strict'

class ErrorHandler extends Error {
  constructor (code, message) {
    super()
    this.statusCode = code
    this.message = message
  }
}

module.exports = ErrorHandler
