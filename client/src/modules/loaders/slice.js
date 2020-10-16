import { createSlice } from '@reduxjs/toolkit'
import { NAME } from './constants'

const initialState = {
  network: {
    isFetching: false,
    isLoaded: false
  },
  human: {
    isFetching: false,
    isLoaded: false
  },
  inter: {
    isFetching: false,
    isLoaded: false
  },
  business: {
    isFetching: false,
    isLoaded: false
  },
  businessMapping: {
    isFetching: false,
    isLoaded: false
  }
}

const slice = createSlice({
  name: NAME,
  initialState: initialState,
  reducers: {
    req: (state, action) => { state[action.payload].isFetching = true },
    res: (state, action) => { state[action.payload].isFetching = false },
    loaded: (state, action) => { state[action.payload].isLoaded = true },
    reset: () => initialState
  }
})

export const { actions, reducer } = slice
