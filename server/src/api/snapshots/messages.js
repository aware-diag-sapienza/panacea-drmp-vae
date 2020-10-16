'use strict'

const socket = require('../../socket')

const update = () => {
  socket.connection().sendRoom('snapshots', 'update')
}

module.exports = {
  update
}
