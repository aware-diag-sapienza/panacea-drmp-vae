import React from 'react'
import { IconButton } from '@material-ui/core'
import { VpnKey, Visibility, VisibilityOff } from '@material-ui/icons'
import TextField from './TextField'

const VisibilityToggle = ({ showPassword, handleShowPassword }) => {
  return (
    <IconButton onClick={handleShowPassword}>
      {showPassword ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  )
}

const TextFieldPassword = (props) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)
  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      End={() => <VisibilityToggle showPassword={showPassword} handleShowPassword={handleShowPassword} />}
    />
  )
}

TextFieldPassword.defaultProps = {
  label: 'Password',
  Start: VpnKey
}

export default TextFieldPassword
