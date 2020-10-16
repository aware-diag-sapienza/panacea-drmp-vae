import axios from 'axios'
import { conf } from '../../config'
import { actions } from './slice'

const url = `${conf.server.url}/api/users`

export const getAll = () => {
  return dispatch => {
    dispatch(actions.req())
    return axios.get(`${url}/getAll`)
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          dispatch(actions.updateEntries(payload.users))
          dispatch(actions.res())
          return Promise.resolve()
        } else {
          dispatch(actions.res())
          Promise.reject(error)
        }
      })
      .catch(err => {
        dispatch(actions.res())
        Promise.reject(err)
      })
  }
}

export const register = ({ username, removable = undefined, privileges = undefined }) => {
  return dispatch => {
    dispatch(actions.req())
    return axios.post(`${url}/register`, { username, removable, privileges })
      .then(res => {
        const { success, error, payload } = res.data
        dispatch(actions.res())
        if (success) return Promise.resolve(payload.user)
        else Promise.reject(error)
      })
      .catch(err => {
        dispatch(actions.res())
        Promise.reject(err)
      })
  }
}

export const updatePrivileges = ({ username, privileges = undefined }) => {
  return dispatch => {
    dispatch(actions.req())
    return axios.put(`${url}/updatePrivileges`, { username, privileges })
      .then(res => {
        const { success, error, payload } = res.data
        dispatch(actions.res())
        if (success) return Promise.resolve(payload.user)
        else Promise.reject(error)
      })
      .catch(err => {
        dispatch(actions.res())
        Promise.reject(err)
      })
  }
}

export const remove = ({ username }) => {
  return dispatch => {
    dispatch(actions.req())
    return axios.delete(`${url}/remove`, { data: { username } })
      .then(res => {
        const { success, error } = res.data
        dispatch(actions.res())
        if (success) return Promise.resolve()
        else Promise.reject(error)
      })
      .catch(err => {
        dispatch(actions.res())
        Promise.reject(err)
      })
  }
}
