import React from 'react'
import clsx from 'clsx'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { Backdrop } from '@material-ui/core'
import { Facebook } from 'react-spinners-css'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
    // color: '#fff'
  },
  root: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1
  },
  component: {

  }
}))

const withSpinner = (Component) => {
  const WithSpinner = (props) => {
    const { loading, className, ...other } = props
    const theme = useTheme()
    const classes = useStyles()
    return (
      <>
        {loading &&
          <Backdrop className={classes.backdrop} classes={{ root: classes.root }} open={loading}>
            <Facebook color={theme.palette.primary.main} />
          </Backdrop>}
        <Component className={clsx(classes.component, className)} {...other} />
      </>

    )
  }
  return WithSpinner
}

export default withSpinner
