import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  component: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(2)
    }
  }
}))

const withContainerVertical = (Component) => {
  const WithContainerVertical = (props) => {
    const { className, ...other } = props
    const classes = useStyles()
    return (
      <Component className={clsx(classes.component, className)} {...other} />
    )
  }
  return WithContainerVertical
}

export default withContainerVertical
