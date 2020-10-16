import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withSnackbar } from 'notistack'

import { TableMaterial } from '../../../components'
import { isFetching, isUpdated, getEntries } from '../selectors'
import { getAll, register, remove, updatePrivileges } from '../thunks'

const columns = [
  {
    field: 'username',
    title: 'Username',
    type: 'string',
    editable: 'onAdd'
  },
  {
    field: 'active',
    title: 'Active',
    type: 'boolean',
    editable: 'never',
    initalEditValue: false
  },
  {
    field: 'activation',
    title: 'Activation Code',
    type: 'string',
    editable: 'never'
  },
  {
    field: 'users',
    title: 'Users Privilege',
    type: 'boolean',
    editable: 'always',
    initalEditValue: false
  },
  {
    field: 'network',
    title: 'Network Privilege',
    type: 'boolean',
    editable: 'always',
    initalEditValue: true
  },
  {
    field: 'human',
    title: 'Human Privilege',
    type: 'boolean',
    editable: 'always',
    initalEditValue: true
  },
  {
    field: 'business',
    title: 'Business Privilege',
    type: 'boolean',
    editable: 'always',
    initalEditValue: true
  }
]

const getPrivileges = (row) => {
  const ps = ['users', 'network', 'human', 'business']
  const privileges = {}
  ps.forEach(p => { privileges[p] = row[p] ? row[p] : false })
  return privileges
}

const Users = (props) => {
  const { enqueueSnackbar } = props
  const fetching = useSelector(isFetching)
  const updated = useSelector(isUpdated)
  const users = useSelector(getEntries).map(u => {
    const user = {
      username: u.username,
      active: u.active,
      activation: u.activation,
      removable: u.removable
    }
    Object.entries(u.privileges).forEach(([k, v]) => { user[k] = v })
    return user
  })
  const dispatch = useDispatch()
  useEffect(() => {
    if (!updated) {
      dispatch(getAll())
        .then(() => enqueueSnackbar('Users updated', { variant: 'success' }))
        .catch(err => enqueueSnackbar(`${err.status} - ${err.message}`, { variant: 'error' }))
    }
  }, [updated, dispatch, enqueueSnackbar])
  return (
    <TableMaterial
      style={{ margin: 'auto' }}
      loading={fetching}
      title='Users'
      columns={columns}
      data={users}
      editable={{
        isEditable: rowData => rowData.removable === true,
        isDeletable: rowData => rowData.removable === true,
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            const username = newData.username
            const removable = true
            const privileges = getPrivileges(newData)
            dispatch(register({ username, removable, privileges }))
              .then(_res => resolve())
              .catch(err => reject(err))
          }),
        onRowUpdate: (newData, _) =>
          new Promise((resolve, reject) => {
            const username = newData.username
            const privileges = getPrivileges(newData)
            dispatch(updatePrivileges({ username, privileges }))
              .then(_res => resolve())
              .catch(err => reject(err))
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            const username = oldData.username
            dispatch(remove({ username }))
              .then(_res => resolve())
              .catch(err => reject(err))
          })
      }}
    />
  )
}

export default withSnackbar(Users)
