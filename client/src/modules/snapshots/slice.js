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
      state.entries = action.payload
      state.isUpdated = true
    },
    reqLoading: (state) => { state.isLoading = true },
    resLoading: (state) => { state.isLoading = false },
    updateSelected: (state, action) => {
      state.selected = action.payload
    },
    reset: () => initialState
  }
})

export const { actions, reducer } = slice
