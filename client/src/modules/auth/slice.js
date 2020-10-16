import { createSlice } from '@reduxjs/toolkit'
import { NAME } from './constants'

const initialState = {
  authenticated: false,
  session: null,
  isFetching: false,
  id: null,
  username: null,
  privileges: {
    users: false,
    network: false,
    human: false,
    business: false
  }
}

const slice = createSlice({
  name: NAME,
  initialState: initialState,
  reducers: {
    req: (state) => { state.isFetching = true },
    res: (state) => { state.isFetching = false },
    logged: (state, action) => {
      const { authenticated, session, id, username, privileges } = action.payload
      if (authenticated) {
        state.authenticated = true
        state.session = session
        state.id = id
        state.username = username
        Object.entries(privileges).forEach(([k, v]) => {
          state.privileges[k] = v
        })
      }
    },
    reset: () => initialState
  }
})

export const { actions, reducer } = slice
