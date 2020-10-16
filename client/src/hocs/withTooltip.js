import React from 'react'
import clsx from 'clsx'
import { Popper, Paper } from '@material-ui/core'
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

const withTooltip = (Component) => {
  const WithTooltip = (props) => {
    const { open, anchorEl, className, ...other } = props
    const classes = useStyles()
    return (
      <Popper open={open} anchorEl={anchorEl}>
        <Paper>
          <Component className={clsx(classes.component, className)} {...other} />
        </Paper>
      </Popper>
    )
  }
  return WithTooltip
}

export default withTooltip
