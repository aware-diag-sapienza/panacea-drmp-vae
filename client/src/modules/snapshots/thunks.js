import axios from 'axios'
import { conf } from '../../config'
import loaders from '../loaders'
import queries from '../queries'
import { actions } from './slice'

const url = `${conf.server.url}/api/snapshots`

export const getAll = () => {
  return dispatch => {
    dispatch(actions.reqEntries())
    return axios.get(`${url}/getAll`)
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          dispatch(actions.updateEntries(payload.snapshots))
          dispatch(actions.resEntries())
          return Promise.resolve(true)
        } else {
          dispatch(actions.resEntries())
          return Promise.reject(error)
        }
      })
      .catch(err => {
        dispatch(actions.resData())
        return Promise.reject(err)
      })
  }
}

export const select = ({ snapshotId, dataPrivileges }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch(actions.reqLoading())
      dispatch(loaders.thunks.getSnapshot({ snapshotId, dataPrivileges }))
        .then(() =>
          dispatch(queries.thunks.getAll(snapshotId))
            .then(() => {
              dispatch(actions.updateSelected(snapshotId))
              dispatch(actions.resLoading())
              return resolve(true)
            })
            .catch(err => {
              dispatch(actions.resLoading())
              return reject(err)
            }))
    })
  }
}
