'use strict'

const asyncHandler = require('express-async-handler')
const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../../error')
const actions = require('./actions')

const getQueries = asyncHandler(async (req, _res, next) => {
  try {
    const queries = await actions.getQueries(req.query.snapshotId)
    req.queries = queries
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const getQueryOutput = asyncHandler(async (req, _res, next) => {
  try {
    const queryOut = await actions.getQueryOutput(req.query.snapshotId, req.query.queryId)
    req.queryOut = queryOut
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const postQuery = asyncHandler(async (req, _res, next) => {
  try {
    const queryId = await actions.postQuery(req.body.snapshotId, req.body.query)
    req.queryId = queryId
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

module.exports = {
  getQueries,
  getQueryOutput,
  postQuery
}
