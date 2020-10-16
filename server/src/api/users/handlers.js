'use strict'

const asyncHandler = require('express-async-handler')
const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../../error')
const actions = require('./actions')
const messages = require('./messages')

const getAll = asyncHandler(async (req, _res, next) => {
  try {
    const users = await actions.getAll()
    req.users = users
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const register = asyncHandler(async (req, _res, next) => {
  try {
    const { username, removable, privileges } = req.body
    const user = await actions.register(username, removable, privileges)
    req.userRegistered = user
    messages.update()
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const updatePrivileges = asyncHandler(async (req, _res, next) => {
  try {
    const { username, privileges } = req.body
    const user = await actions.updatePrivileges(username, privileges)
    req.userUpdated = user
    messages.update()
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const remove = asyncHandler(async (req, _res, next) => {
  try {
    const { username } = req.body
    await actions.remove(username)
    messages.update()
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

module.exports = {
  getAll,
  register,
  updatePrivileges,
  remove
}
