import { createSlice } from '@reduxjs/toolkit'
import { NAME } from './constants'

const initialState = {
  isFetching: false,
  isUpdated: false,
  entries: []
}

const slice = createSlice({
  name: NAME,
  initialState: initialState,
  reducers: {
    req: (state) => { state.isFetching = true },
    res: (state) => { state.isFetching = false },
    updateAvailable: (state) => { state.isUpdated = false },
    updateEntries: (state, action) => {
      state.entries = action.payload.map(u => {
        const user = {
          username: u.username,
          active: u.active,
          activation: u.activation,
          removable: u.removable,
          privileges: u.privileges
        }
        return user
      })
      state.isUpdated = true
    },
    reset: () => initialState
  }
})

export const { actions, reducer } = slice
