export const connect = (session) => ({ type: 'CONNECT', payload: { session } })

export const disconnect = () => ({ type: 'DISCONNECT' })

export const join = (room) => ({ type: 'JOIN', payload: { room } })

export const leave = (room) => ({ type: 'LEAVE', payload: { room } })
