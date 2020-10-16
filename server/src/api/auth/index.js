'use strict'

const actions = require('./actions')
const admin = require('./admin')
const handlers = require('./handlers')
const passport = require('./passport')

module.exports = {
  actions,
  admin,
  handlers,
  passport
}
