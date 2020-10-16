'use strict'

const error = require('../error')
const apiRoute = require('./api')
const homeRoute = require('./home')
const errorRoute = require('./error')

const init = (app) => {
  app.use('/api', apiRoute)
  app.use('*', homeRoute)
  app.use('*', errorRoute)
  app.use(error.handlers.sendError)
}

module.exports = {
  init
}
