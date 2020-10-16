import io from 'socket.io-client'

import { conf } from '../../config'
import socket from '../../socket'
import { users } from '../../modules'

const middleware = () => {
  let soc = null
  const onUpdate = (store, msg) => {
    const { room } = msg
    switch (room) {
      case 'users':
        store.dispatch(users.actions.updateAvailable())
        break
      default:
        break
    }
  }

  return store => next => action => {
    switch (action.type) {
      case 'CONNECT':
        if (soc !== null) soc.close()
        soc = io(conf.server.socketUrl, {
          query: 'session_id=' + action.payload.session,
          transports: ['websocket'],
          rejectUnauthorized: false
        })
        soc.on('connect', () => {
          soc.on('update', msg => onUpdate(store, msg))
        })
        break
      case 'DISCONNECT':
        if (soc !== null) soc.close()
        soc = null
        break
      case 'JOIN':
        if (soc === null) store.dispatch(socket.actions.connect())
        soc.emit('join', action.payload.room)
        break
      case 'LEAVE':
        if (soc === null) store.dispatch(socket.actions.connect())
        soc.emit('leave', action.payload.room)
        break
      default:
        return next(action)
    }
  }
}

export default middleware()
