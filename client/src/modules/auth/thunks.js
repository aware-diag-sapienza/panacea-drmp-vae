import axios from 'axios'
import { conf } from '../../config'
import socket from '../../socket'
import { users, snapshots } from '../index'
import { actions } from './slice'

const url = `${conf.server.url}/api/auth`

export const activate = ({ activation, password }) => {
  return dispatch => {
    dispatch(actions.req())
    return axios.put(`${url}/activate`, { activation, password })
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          dispatch(actions.res())
          return Promise.resolve(payload.user.username)
        } else {
          dispatch(actions.res())
          return Promise.reject(error)
        }
      })
      .catch(err => {
        dispatch(actions.reset())
        dispatch(actions.res())
        return Promise.reject(err)
      })
  }
}

export const login = ({ username, password }) => {
  return dispatch => {
    dispatch(actions.req())
    axios.defaults.withCredentials = true
    return axios({
      method: 'post',
      url: `${url}/login`,
      withCredentials: true,
      credentials: 'include',
      headers: {
        crossDomain: true,
        'Content-Type': 'application/json'
      },
      data: {
        username,
        password
      }
    })
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          const { id, username, privileges, session } = payload
          dispatch(actions.logged({
            authenticated: true,
            session,
            id,
            username,
            privileges
          }))
          dispatch(socket.actions.connect(session))
          dispatch(socket.actions.join('snapshots'))
          if (privileges.users) dispatch(socket.actions.join('users'))
          dispatch(actions.res())
          return Promise.resolve()
        } else {
          dispatch(actions.reset())
          dispatch(actions.res())
          return Promise.reject(error)
        }
      })
      .catch(err => {
        dispatch(actions.reset())
        dispatch(actions.res())
        return Promise.reject(err)
      })
  }
}

export const logout = () => {
  return dispatch => {
    dispatch(actions.req())
    return axios.post(`${url}/logout`)
      .then(res => {
        const { success, error } = res.data
        dispatch(actions.reset())
        dispatch(socket.actions.disconnect())
        dispatch(users.actions.reset())
        dispatch(snapshots.actions.reset())
        dispatch(actions.res())
        if (success) {
          return Promise.resolve()
        } else {
          return Promise.reject(error)
        }
      })
      .catch(err => {
        dispatch(actions.res())
        return Promise.reject(err)
      })
  }
}
