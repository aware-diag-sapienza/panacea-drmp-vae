import React from 'react'
import { Button } from '@material-ui/core'

export default (props) => {
  const { children, ...other } = props
  return (
    <Button variant='contained' color='primary' {...other}>
      {children}
    </Button>
  )
}
