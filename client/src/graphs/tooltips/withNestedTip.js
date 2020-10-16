import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  component: {
    maxWidth: theme.breakpoints.values.sm,
    padding: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

const withNestedTip = (Component) => {
  const WithNestedTip = (props) => {
    const { className, ...other } = props
    const classes = useStyles()
    return (
      <Component className={clsx(classes.component, className)} {...other} />
    )
  }
  return WithNestedTip
}

export default withNestedTip
