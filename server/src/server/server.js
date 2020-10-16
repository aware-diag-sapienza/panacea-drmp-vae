'use strict'

const https = require('https')
const mongoose = require('mongoose')

const { conf, db, express, logger, session, stats } = require('../config')
const { auth } = require('../api')
const socket = require('../socket')
const routes = require('../routes')

let server = null

const listen = () => {
  const app = express.init()
  session.init(app)
  auth.passport.init(app)
  db.init()
    .then(() => auth.admin.init())
    .catch(() => {})
  server = https.createServer(conf.server.ssl, app)
  server.listen(conf.server.port)
  logger.debug(`Listening at https://${conf.server.ip}:${conf.server.port}`)
  socket.connect(server)
  routes.init(app)
  stats.memory()
}

const close = () => {
  server.close()
  mongoose.disconnect()
  logger.debug('Server down')
}

module.exports = {
  listen,
  close
}
