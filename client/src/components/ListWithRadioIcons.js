import React from 'react'
import { FormLabel, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import RadioAvatarsGroup from './RadioAvatarsGroup'

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(1)
  },
  actions: {
    display: 'flex'
  },
  radioIcons: {
    padding: `${theme.spacing(1.5)}px 0`
  },
  radioIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: '1rem',
    margin: `0 ${theme.spacing(0.5)}px`
  }
}))

const ListWithRadioIcons = (props) => {
  const { title, entries, radioIcons, ...other } = props
  const classes = useStyles()
  const theme = useTheme()
  return (
    <div className={classes.root}>
      <FormLabel component='legend'>{title}</FormLabel>
      <List {...other}>
        {entries.map(e => {
          return (
            <ListItem key={e.value} className={classes.item}>
              <ListItemAvatar>
                <Avatar variant='square' src={e.avatar} />
              </ListItemAvatar>
              <ListItemText primary={e.text} secondary={e.secondary ? <e.secondary /> : undefined} style={{ paddingRight: radioIcons ? e.radioIcons.length * theme.spacing(4) + theme.spacing(2) : 0 }} />
              <ListItemSecondaryAction className={classes.actions}>
                {radioIcons &&
                  <RadioAvatarsGroup
                    className={classes.radioIcons}
                    entries={e.radioIcons}
                    value={e.selectedRadio}
                    entriesClassName={classes.radioIcon}
                  />}
                <IconButton edge='end' onClick={e.handleActionClick}>
                  {e.action}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

export default ListWithRadioIcons
