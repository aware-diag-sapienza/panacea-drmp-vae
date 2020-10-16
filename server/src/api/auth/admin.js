'use strict'

const { conf, logger } = require('../../config')
const users = require('../users')
const actions = require('./actions')

const init = () => {
  users.actions.getByKey('username', conf.db.admin.username)
    .then(user => {
      if (user === null) {
        const privileges = {
          users: true,
          network: true,
          human: true,
          business: true
        }
        users.actions.register(conf.db.admin.username, false, privileges)
          .then(user => {
            actions.activate(user.activation, conf.db.admin.password)
              .then(() => {
                logger.debug('Admin successfully registered and activated')
              })
          })
      } else {
        if (user.active === false) {
          logger.debug('Admin already registered')
          actions.activate(user.activation, conf.db.admin.password)
            .then(() => logger.debug('Admin successfully activated'))
        } else {
          logger.debug('Admin already activated')
        }
      }
    })
    .catch(err => logger.debug(`Admin initialization error: ${err}`))
}

module.exports = {
  init
}
