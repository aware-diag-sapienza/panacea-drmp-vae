import { createSelector } from 'reselect'
import { NAME } from './constants'

export const slice = state => state[NAME]

export const isAuthenticated = createSelector(
  slice,
  auth => auth.authenticated === true
)

export const getUsername = createSelector(
  slice,
  auth => auth.username
)

export const isFetching = createSelector(
  slice,
  auth => auth.isFetching === true
)

export const getPrivileges = createSelector(
  slice,
  auth => auth.privileges
)

export const usersPrivilege = createSelector(
  slice,
  auth => auth.privileges.users === true
)

export const networkPrivilege = createSelector(
  slice,
  auth => auth.privileges.network === true
)

export const humanPrivilege = createSelector(
  slice,
  auth => auth.privileges.human === true
)

export const businessPrivilege = createSelector(
  slice,
  auth => auth.privileges.business === true
)

export const getDataPrivileges = createSelector(
  slice,
  auth => {
    const dataPrivileges = []
    if (auth.privileges.network) dataPrivileges.push('network')
    if (auth.privileges.human) dataPrivileges.push('human')
    if (auth.privileges.network && auth.privileges.human) dataPrivileges.push('inter')
    if (auth.privileges.business) dataPrivileges.push('business')
    if (auth.privileges.network && auth.privileges.business) dataPrivileges.push('businessMapping')
    return dataPrivileges
  }
)
