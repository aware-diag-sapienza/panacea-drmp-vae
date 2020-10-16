import { createSelector } from 'reselect'
import { NAME } from './constants'

export const slice = state => state[NAME]

export const isFetching = createSelector(
  slice,
  snapshots => snapshots.isFetching === true
)

export const isUpdated = createSelector(
  slice,
  snapshots => snapshots.isUpdated === true
)

export const getEntries = createSelector(
  slice,
  snapshots => snapshots.entries
)

export const getSelected = createSelector(
  slice,
  getEntries,
  (snapshots, entries) => {
    return snapshots.selected !== null
      ? entries[entries.map(s => s.id).indexOf(snapshots.selected)]
      : null
  }
)

export const isLoading = createSelector(
  slice,
  snapshots => snapshots.isLoading === true
)
