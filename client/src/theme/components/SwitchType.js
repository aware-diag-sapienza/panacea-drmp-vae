import React from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from '@material-ui/core'
import { ColorLens } from '@material-ui/icons'

import { actions } from '../slice'

const SwitchType = (props) => {
  const { children, ...other } = props
  const dispatch = useDispatch()
  return (
    <IconButton onClick={() => dispatch(actions.switchPaletteType())} {...other}>
      {children}
    </IconButton>
  )
}

SwitchType.defaultProps = {
  children: <ColorLens />
}

export default SwitchType
