import { createSelector } from 'reselect'
import { NAME } from './constants'

export const slice = state => state[NAME]

export const isFetching = createSelector(
  slice,
  loaders => {
    const fetch = {}
    Object.entries(loaders).forEach(([k, v]) => { fetch[k] = v.isFetching })
    return fetch
  }
)

export const isLoaded = createSelector(
  slice,
  loaders => {
    const load = {}
    Object.entries(loaders).forEach(([k, v]) => { load[k] = v.isLoaded })
    return load
  }
)
