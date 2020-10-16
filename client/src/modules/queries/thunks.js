import axios from 'axios'
import { conf } from '../../config'
import { actions } from './slice'
import { NAME } from './constants'

const url = `${conf.server.url}/api/queries`

export const getAll = (snapshotId) => {
  return dispatch => {
    dispatch(actions.reqEntries())
    return axios.get(`${url}/getQueries`, { params: { snapshotId: snapshotId } })
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          dispatch(actions.updateEntries(payload.queries.map(q => ({
            type: q.type,
            id: q.id,
            name: q.name,
            input: {
              sources: q.sources,
              targets: q.targets
            },
            output: null
          }))))
          dispatch(actions.resEntries())
          return Promise.resolve(true)
        } else {
          dispatch(actions.resEntries())
          return Promise.reject(error)
        }
      })
      .catch(err => {
        dispatch(actions.resEntries())
        return Promise.reject(err)
      })
  }
}

export const postQuery = (snapshotId, query) => {
  return dispatch => {
    return axios.post(`${url}/postQuery`, { snapshotId, query })
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          console.log(payload.queryId)
          return Promise.resolve(payload.queryId)
        } else {
          return Promise.reject(error)
        }
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}

export const getQueryResults = (snapshotId, queryId) => {
  return _dispatch => {
    return axios.get(`${url}/getQueryOutput`, { params: { snapshotId: snapshotId, queryId: queryId } })
      .then(res => {
        const { success, error, payload } = res.data
        if (success) {
          console.log(payload.queryOut)
          return Promise.resolve(payload.queryOut)
        } else {
          return Promise.reject(error)
        }
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}

export const select = (snapshotId, queryId) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.reqLoading())
      const state = getState()[NAME]
      if (state.entries[state.entries.map(e => e.id).indexOf(queryId)].output === null) {
        dispatch(getQueryResults(snapshotId, queryId))
          .then(output => {
            dispatch(actions.updateOutput({ queryId, output }))
            dispatch(actions.updateSelected(queryId))
            dispatch(actions.resLoading())
            return resolve(true)
          })
          .catch(err => {
            dispatch(actions.resLoading())
            return reject(err)
          })
      } else {
        dispatch(actions.updateSelected(queryId))
        dispatch(actions.resLoading())
        return resolve(true)
      }
    })
  }
}
