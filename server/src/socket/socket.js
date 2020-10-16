'use strict'

const cookieParser = require('cookie-parser')
const passportSocketio = require('passport.socketio')

const { conf, logger, session } = require('../config')

let connection = null

function onAuthorizeSuccess (_, accept) {
  logger.debug('Socket client authorized!')
  accept()
}

function onAuthorizeFail (_, message, error, accept) {
  logger.debug('Socket client authorization failed:', message)
  if (error) { accept(new Error(message)) }
}

class Socket {
  constructor () {
    this._io = null
    this._socket = null
  }

  connect (server) {
    this._io = require('socket.io')(server)
    this._io.use(passportSocketio.authorize({
      key: conf.redis.key,
      secret: conf.redis.secret,
      store: session.redisStore,
      cookieParser: cookieParser,
      fail: onAuthorizeFail,
      success: onAuthorizeSuccess
    }))
    this._io.on('connection', (socket) => {
      this._socket = socket
      logger.debug(`Socket client ${socket.id} connected!`)
      this._socket.on('disconnect', () => logger.debug(`Socket client ${socket.id} disconnected!`))
      this._socket.on('join', room => {
        if (socket.request.user && socket.request.user.logged_in && room === 'snapshots') {
          this._socket.join(room)
          logger.debug(`Socket client ${socket.id} join ${room}`)
        }
        if (socket.request.user && socket.request.user.logged_in && socket.request.user.privileges[room]) {
          this._socket.join(room)
          logger.debug(`Socket client ${socket.id} join ${room}`)
        }
      })
    })
  }

  send (event, data) {
    this._socket.emit(event, { data })
  }

  sendRoom (room, event, data) {
    this._io.to(room).emit(event, { room, data })
  }

  register (event, handler) {
    this._socket.on(event, handler)
  }

  static init (server) {
    if (!connection) {
      connection = new Socket()
      connection.connect(server)
      logger.debug('Socket connected')
    }
  }

  static getConnection () {
    if (!connection) throw new Error('No active connection')
    return connection
  }
}

module.exports = {
  connect: Socket.init,
  connection: Socket.getConnection
}
