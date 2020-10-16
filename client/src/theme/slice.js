import { createSlice } from '@reduxjs/toolkit'
import { NAME } from './constants'

const initialState = {
  typography: {
    useNextVariants: true
  },
  palette: {
    type: 'light',
    primary: {
      main: '#21921d'
    }
  }
}

const slice = createSlice({
  name: NAME,
  initialState: initialState,
  reducers: {
    switchPaletteType: (state) => {
      if (state.palette.type === 'light') state.palette.type = 'dark'
      else state.palette.type = 'light'
    }
  }
})

export const { reducer, actions } = slice
