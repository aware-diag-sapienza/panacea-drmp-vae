import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormLabel, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1)
  }
}))

const RadioButtonsGroup = (props) => {
  const { title, handleChange, entries, value } = props
  const classes = useStyles()
  const onChange = (event) => { handleChange(event.target.value) }
  return (
    <div className={classes.root}>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>{title}</FormLabel>
        <RadioGroup value={value} onChange={onChange}>
          {entries.map(e =>
            <FormControlLabel
              key={e.name}
              value={e.name}
              control={<Radio />}
              label={e.label}
            />
          )}
        </RadioGroup>
      </FormControl>
    </div>
  )
}

export default RadioButtonsGroup
