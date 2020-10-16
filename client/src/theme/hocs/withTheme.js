import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useSelector } from 'react-redux'

import { NAME } from '../constants'

const withTheme = (Component) => {
  const WithTheme = (props) => {
    const theme = useSelector((state) => state[NAME])
    return (
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }
  return WithTheme
}

export default withTheme
