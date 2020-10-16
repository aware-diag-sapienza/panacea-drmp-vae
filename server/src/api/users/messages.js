'use strict'

const socket = require('../../socket')

const update = () => {
  socket.connection().sendRoom('users', 'update')
}

module.exports = {
  update
}
