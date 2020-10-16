'use strict'

const asyncHandler = require('express-async-handler')
const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../../error')
const actions = require('./actions')

const activate = asyncHandler(async (req, _res, next) => {
  try {
    const { activation, password } = req.body
    const user = await actions.activate(activation, password)
    req.userActivated = user
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const login = asyncHandler(async (req, res, next) => {
  try {
    await actions.login(req, res)
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const logout = asyncHandler(async (req, _res, next) => {
  try {
    await actions.logout(req)
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.METHOD_FAILURE, err.message))
  }
})

const isAuthenticated = asyncHandler(async (req, _res, next) => {
  try {
    await req.isAuthenticated()
    next()
  } catch (err) {
    next(new ErrorHandler(HttpStatus.UNAUTHORIZED, 'User not authenticated'))
  }
})

const isActive = asyncHandler(async (req, _res, next) => {
  const { user } = req
  if (user.active === true) next()
  else next(new ErrorHandler(HttpStatus.METHOD_NOT_ALLOWED, `User '${user.username}' is not active`))
})

const hasUsersPrivilege = asyncHandler(async (req, _res, next) => {
  const { user } = req
  if (user.privileges.users === true) next()
  else next(new ErrorHandler(HttpStatus.METHOD_NOT_ALLOWED, `User '${user.username}' has not users privilege`))
})

const hasNetworkPrivilege = asyncHandler(async (req, _res, next) => {
  const { user } = req
  if (user.privileges.network === true) next()
  else next(new ErrorHandler(HttpStatus.METHOD_NOT_ALLOWED, `User '${user.username}' has not network privilege`))
})

const hasHumanPrivilege = asyncHandler(async (req, _res, next) => {
  const { user } = req
  if (user.privileges.human === true) next()
  else next(new ErrorHandler(HttpStatus.METHOD_NOT_ALLOWED, `User '${user.username}' has not human privilege`))
})

const hasBusinessPrivilege = asyncHandler(async (req, _res, next) => {
  const { user } = req
  if (user.privileges.business === true) next()
  else next(new ErrorHandler(HttpStatus.METHOD_NOT_ALLOWED, `User '${user.username}' has not business privilege`))
})

module.exports = {
  activate,
  login,
  logout,
  isAuthenticated,
  isActive,
  hasUsersPrivilege,
  hasNetworkPrivilege,
  hasHumanPrivilege,
  hasBusinessPrivilege
}
