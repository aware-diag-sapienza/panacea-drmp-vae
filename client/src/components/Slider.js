import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Slider as MaterialSlider, FormLabel } from '@material-ui/core'

import { arraysEqual } from '../utils'

const useStyles = makeStyles(theme => ({
  root: {
    width: 300,
    padding: theme.spacing(1)
  },
  slider: {
    marginTop: theme.spacing(5)
  }
}))

const Slider = (props) => {
  const { className, title, value, handleChange, ...other } = props
  const classes = useStyles()
  const onChange = (_, newValue) => {
    if (Array.isArray(value) && Array.isArray(newValue)) {
      if (!arraysEqual(value, newValue)) handleChange(newValue)
    } else {
      if (value !== newValue) handleChange(newValue)
    }
  }
  return (
    <div className={clsx(classes.root, className)}>
      <FormLabel component='legend'>{title}</FormLabel>
      <MaterialSlider
        className={classes.slider}
        value={value}
        onChange={onChange}
        valueLabelDisplay='on'
        {...other}
      />
    </div>
  )
}

export default Slider
