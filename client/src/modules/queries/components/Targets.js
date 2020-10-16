import React from 'react'
import { FormLabel, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, TextField, InputAdornment } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    maxWidth: theme.spacing(20)
  },
  secondaryText: {
    display: 'flex',
    flexDirection: 'column'
  }
}))
const Targets = (props) => {
  const { targets } = props
  const classes = useStyles()
  const theme = useTheme()
  return (
    <div>
      <FormLabel component='legend'>Targets</FormLabel>
      <List>
        {targets.map(t => {
          return (
            <ListItem key={t.id} className={classes.item}>
              <ListItemAvatar>
                <Avatar variant='square' src={t.avatar} />
              </ListItemAvatar>
              <ListItemText classes={{ secondary: classes.secondaryText }} primary={t.name} secondary={<t.CIA />} style={{ paddingRight: theme.spacing(20) }} />
              <ListItemSecondaryAction className={classes.actions}>
                <TextField
                  id={`${t.id}-impact`}
                  fullWidth
                  defaultValue={t.defaultImpact}
                  helperText={`Default impact: ${t.defaultImpact}`}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>Impact: </InputAdornment>
                  }}
                  onChange={t.handleChange}
                />
                <IconButton edge='end' onClick={t.handleDelete}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

export default Targets
