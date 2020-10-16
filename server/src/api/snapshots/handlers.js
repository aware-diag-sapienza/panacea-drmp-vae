'use strict'

const asyncHandler = require('express-async-handler')
const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../../error')
const actions = require('./actions')

const getAll = asyncHandler(async (req, _res, next) => {
  try {
    const snapshots = await actions.getAll()
    req.snapshots = snapshots
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

module.exports = {
  getAll
}
