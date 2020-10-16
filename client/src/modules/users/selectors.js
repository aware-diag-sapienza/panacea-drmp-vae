import { createSelector } from 'reselect'
import { NAME } from './constants'

export const slice = state => state[NAME]

export const isAuth = createSelector(
  slice,
  users => users.isAuth === true
)

export const isFetching = createSelector(
  slice,
  users => users.isFetching === true
)

export const isUpdated = createSelector(
  slice,
  users => users.isUpdated === true
)

export const getEntries = createSelector(
  slice,
  users => users.entries
)
