'use strict'

const asyncHandler = require('express-async-handler')
const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../../error')
const actions = require('./actions')

const getSnapshotId = (req) => req.query.snapshotId

const getNetwork = asyncHandler(async (req, _res, next) => {
  try {
    const network = await actions.getNetwork(getSnapshotId(req))
    req.network = network
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const getHuman = asyncHandler(async (req, _res, next) => {
  try {
    const human = await actions.getHuman(getSnapshotId(req))
    req.human = human
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const getInter = asyncHandler(async (req, _res, next) => {
  try {
    const inter = await actions.getInter(getSnapshotId(req))
    req.inter = inter
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const getBusiness = asyncHandler(async (req, _res, next) => {
  try {
    const business = await actions.getBusiness(getSnapshotId(req))
    req.business = business
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const getBusinessMapping = asyncHandler(async (req, _res, next) => {
  try {
    const businessMapping = await actions.getBusinessMapping(getSnapshotId(req))
    req.businessMapping = businessMapping
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

module.exports = {
  getNetwork,
  getHuman,
  getInter,
  getBusiness,
  getBusinessMapping
}
