import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh'
  }
}))

const withPage = (Component) => {
  const WithPage = (props) => {
    const classes = useStyles()
    return (
      <Component className={classes.root} {...props} />
    )
  }
  return WithPage
}

export default withPage
