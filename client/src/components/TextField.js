import React from 'react'
import { nanoid } from 'nanoid'
import { InputAdornment, FormControl, InputLabel, Input } from '@material-ui/core'
import { TextFields } from '@material-ui/icons'

const TextField = (props) => {
  const { label, Start, End, ...other } = props
  const [id] = React.useState(nanoid)
  return (
    <FormControl>
      <InputLabel htmlFor={`textfield-${id}`}>{label}</InputLabel>
      <Input
        id={`textfield-${id}`}
        startAdornment={<InputAdornment position='start'><Start /></InputAdornment>}
        endAdornment={<InputAdornment position='start'><End /></InputAdornment>}
        {...other}
      />
    </FormControl>
  )
}

TextField.defaultProps = {
  label: 'text-field',
  Start: TextFields,
  End: 'span'
}

export default TextField
