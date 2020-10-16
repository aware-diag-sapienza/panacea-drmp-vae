import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormLabel, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1)
  }
}))

export default function CheckboxesGroup (props) {
  const { title, handleChange, entries } = props
  const classes = useStyles()
  const onChange = (event) => handleChange(event.target.name, event.target.checked)
  return (
    <div className={classes.root}>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>{title}</FormLabel>
        <FormGroup>
          {entries.map(e =>
            <FormControlLabel
              key={e.name}
              control={
                <Checkbox
                  key={e.name}
                  checked={e.value}
                  name={e.name}
                  onChange={onChange}
                />
              }
              label={e.label}
            />
          )}
        </FormGroup>
      </FormControl>
    </div>
  )
}
