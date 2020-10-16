import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withSnackbar } from 'notistack'
import { Box, FormControl, Select, MenuItem, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ButtonPrimary } from '../../../components'
import { withSpinner } from '../../../hocs'
import auth from '../../auth'
import { isFetching, isUpdated, getEntries, getSelected } from '../selectors'
import { getAll, select } from '../thunks'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'start',
    padding: theme.spacing(2)
  },
  form: {
    minWidth: 250,
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(2)
  }
}))

const Picker = (props) => {
  const classes = useStyles()
  const { enqueueSnackbar } = props
  const dataPrivileges = useSelector(auth.selectors.getDataPrivileges)
  const fetching = useSelector(isFetching)
  const updated = useSelector(isUpdated)
  const entries = useSelector(getEntries)
  const selected = useSelector(getSelected)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!updated) {
      dispatch(getAll())
        .then(() => enqueueSnackbar('Snapshots updated', { variant: 'success' }))
        .catch(err => enqueueSnackbar(`${err.status} - ${err.message}`, { variant: 'error' }))
    }
  }, [updated, dispatch, enqueueSnackbar])
  const [current, setCurrent] = React.useState(selected ? selected.id : '')
  const handleChange = (event) => setCurrent(event.target.value)
  const handleSelect = () => {
    if (current !== '') dispatch(select({ snapshotId: current, dataPrivileges }))
  }
  const Root = withSpinner(Box)
  return (
    <Root className={classes.root} loading={fetching}>
      <FormControl className={classes.form}>
        <Select value={current} onChange={handleChange}>
          {entries.map(s => <MenuItem key={s.id} value={s.id}>{s.timestamp}</MenuItem>)}
        </Select>
        <FormHelperText>Select a snapshot</FormHelperText>
      </FormControl>
      <ButtonPrimary className={classes.button} onClick={handleSelect}>Load</ButtonPrimary>
    </Root>
  )
}

export default withSnackbar(Picker)
