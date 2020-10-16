import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  entrySelected: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    border: `1px solid ${theme.palette.secondary.contrastText}`
  },
  entryUnselected: {
    backgroundColor: theme.palette.secondary.contrastText,
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.secondary.main}`
  }
}))

const RadioAvatarsGroup = (props) => {
  const { className, entries, value, entriesClassName, entriesProps } = props
  const classes = useStyles()
  return (
    <div className={clsx(className, classes.root)}>
      {entries.map(e =>
        <Avatar
          key={e.value}
          className={clsx(entriesClassName, value === e.value ? classes.entrySelected : classes.entryUnselected)}
          onClick={e.handleClick}
          {...entriesProps}
        >
          {e.icon}
        </Avatar>
      )}
    </div>
  )
}

export default RadioAvatarsGroup
