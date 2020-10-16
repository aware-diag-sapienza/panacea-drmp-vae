import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withSnackbar } from 'notistack'
import { useForm, Controller } from 'react-hook-form'
import { Person } from '@material-ui/icons'

import { ButtonPrimary, TextField, TextFieldPassword } from '../../../components'
import { withFlexContainerVertical, withSpinner } from '../../../hocs'
import { isFetching } from '../selectors'
import { login } from '../thunks'

const Login = (props) => {
  const dispatch = useDispatch()
  const isFetch = useSelector(isFetching)
  const { control, handleSubmit } = useForm()
  const onSubmit = data => dispatch(login(data))
    .then(() => props.enqueueSnackbar('Logged in', { variant: 'success' }))
    .catch(err => props.enqueueSnackbar(`${err.status} - ${err.message}`, { variant: 'error' }))
  const Form = withSpinner(withFlexContainerVertical('form'))
  return (
    <Form loading={isFetch} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        as={TextField}
        control={control}
        defaultValue=''
        name='username'
        label='Enter Username'
        Start={Person}
      />
      <Controller
        as={TextFieldPassword}
        control={control}
        defaultValue=''
        name='password'
        label='Enter Password'
      />
      <ButtonPrimary type='submit'>Login</ButtonPrimary>
    </Form>
  )
}

export default withSnackbar(Login)
