import { createSlice } from '@reduxjs/toolkit'
import { NAME } from './constants'

const initialState = {
  isFetching: false,
  isUpdated: false,
  entries: [],
  isLoading: false,
  selected: null
}

const slice = createSlice({
  name: NAME,
  initialState: initialState,
  reducers: {
    reqEntries: (state) => { state.isFetching = true },
    resEntries: (state) => { state.isFetching = false },
    updateAvailable: (state) => { state.isUpdated = false },
    updateEntries: (state, action) => {
      const newEntries = action.payload.filter(e => state.entries.map(en => en.id).indexOf(e.id) < 0)
      state.entries = state.entries.concat(newEntries)
      state.isUpdated = true
    },
    reqLoading: (state) => { state.isLoading = true },
    resLoading: (state) => { state.isLoading = false },
    updateSelected: (state, action) => {
      state.selected = action.payload
    },
    updateOutput: (state, action) => {
      state.entries[state.entries.map(e => e.id).indexOf(action.payload.queryId)].output = action.payload.output
    },
    reset: () => initialState
  }
})

export const { actions, reducer } = slice
