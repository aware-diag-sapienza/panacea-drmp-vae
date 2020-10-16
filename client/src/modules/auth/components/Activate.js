import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withSnackbar } from 'notistack'
import { useForm, Controller } from 'react-hook-form'
import { Code } from '@material-ui/icons'

import { ButtonPrimary, TextField, TextFieldPassword } from '../../../components'
import { withFlexContainerVertical, withSpinner } from '../../../hocs'
import { isFetching } from '../selectors'
import { activate } from '../thunks'

const Activate = (props) => {
  const dispatch = useDispatch()
  const isFetch = useSelector(isFetching)
  const { control, handleSubmit } = useForm()
  const onSubmit = data => {
    if (data.password === data.password2) {
      dispatch(activate({ activation: data.activation, password: data.password }))
        .then((username) => props.enqueueSnackbar(`User ${username} activated`, { variant: 'success' }))
        .catch(err => props.enqueueSnackbar(`${err.status} - ${err.message}`, { variant: 'error' }))
    } else {
      props.enqueueSnackbar('Passwords don\'t match', { variant: 'error' })
    }
  }
  const Form = withSpinner(withFlexContainerVertical('form'))
  return (
    <Form loading={isFetch} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        as={TextField}
        control={control}
        defaultValue=''
        name='activation'
        label='Enter Activation Hash'
        Start={Code}
      />
      <Controller
        as={TextFieldPassword}
        control={control}
        defaultValue=''
        name='password'
        label='Enter Password'
      />
      <Controller
        as={TextFieldPassword}
        control={control}
        defaultValue=''
        name='password2'
        label='Re-enter Password'
      />
      <ButtonPrimary type='submit'>Activate</ButtonPrimary>
    </Form>
  )
}

export default withSnackbar(Activate)
