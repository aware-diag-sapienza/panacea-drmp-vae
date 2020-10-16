import { createSelector as ormSelector } from 'redux-orm'
import { createSelector } from 'reselect'

import orm from '../orm'

export const credentials = ormSelector(orm.Credential)

export const credentialsPerson = ormSelector(
  credentials,
  orm.Credential.person,
  (_, idArg) => idArg,
  (credentials, person, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return credentials.map((cred, idx) => ({
        id: cred.id,
        person: person[idx]
      }))
    } else {
      return {
        id: credentials.id,
        person: person
      }
    }
  }
)
export const credentialsDevicePrivileges = ormSelector(
  credentials,
  orm.Credential.devicePrivileges,
  (_, idArg) => idArg,
  (credentials, devicePrivileges, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return credentials.map((cred, idx) => ({
        id: cred.id,
        devicePrivileges: devicePrivileges[idx]
      }))
    } else {
      return {
        id: credentials.id,
        devicePrivileges: devicePrivileges
      }
    }
  }
)
export const credentialsPersonDevicePrivileges = createSelector(
  credentialsPerson,
  credentialsDevicePrivileges,
  (_, idArg) => idArg,
  (credentialsPerson, credentialsDevicePrivileges, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return credentialsPerson.map((credPer, idx) => ({
        id: credPer.id,
        person: credPer.person,
        devicePrivileges: credentialsDevicePrivileges[idx].devicePrivileges
      }))
    } else {
      return {
        id: credentialsPerson.id,
        person: credentialsPerson.person,
        devicePrivileges: credentialsDevicePrivileges.devicePrivileges
      }
    }
  }
)
