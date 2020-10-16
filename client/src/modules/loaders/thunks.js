import axios from 'axios'
import { conf } from '../../config'
import schema from '../../schema'
import { actions } from './slice'

const url = `${conf.server.url}/api/loaders`

const getData = ({ snapshotId, entry }) => {
  const Entry = entry[0].toUpperCase() + entry.slice(1)
  return axios.get(`${url}/get${Entry}`, { params: { snapshotId: snapshotId } })
    .then(res => {
      const { success, error, payload } = res.data
      if (success) {
        return Promise.resolve(payload[entry])
      } else return Promise.reject(error)
    })
    .catch(err => Promise.reject(err))
}

export const getSnapshot = ({ snapshotId, dataPrivileges }) => {
  return dispatch => {
    dataPrivileges.forEach(p => dispatch(actions.req(p)))
    return new Promise((resolve, reject) => {
      Promise.all(dataPrivileges.map(p => getData({ snapshotId, entry: p })))
        .then((values) => {
          dataPrivileges.forEach((p, idx) => dispatch(schema.actions[`load${p[0].toUpperCase() + p.slice(1)}`]({ [p]: values[idx] })))
          dataPrivileges.forEach(p => dispatch(actions.loaded(p)))
          dataPrivileges.forEach(p => dispatch(actions.res(p)))
          return resolve(true)
        })
        .catch(err => {
          dataPrivileges.forEach(p => dispatch(actions.res(p)))
          return reject(err)
        })
    })
  }
}
