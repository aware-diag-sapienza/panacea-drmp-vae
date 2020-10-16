import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import withFlexContainer from './withFlexContainer'

const useStyles = makeStyles(theme => ({
  component: {
    flexDirection: 'column'
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
  return withFlexContainer(WithContainerVertical)
}

export default withContainerVertical
