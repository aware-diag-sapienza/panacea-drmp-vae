import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export const persons = ormSelector(orm.Person)

export const personsType = ormSelector(
  persons,
  orm.Person.roles,
  (_, idArg) => idArg,
  (persons, roles, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return persons.map((per, idx) => ({
        id: per.id,
        type: roles[idx].filter(r => r.timeEnd === 'present')[0].position
      }))
    } else {
      return {
        id: persons.id,
        type: roles.filter(r => r.timeEnd === 'present')[0].position
      }
    }
  }
)

export const personsLocation = ormSelector(
  persons,
  orm.Person.locations,
  (_, idArg) => idArg,
  (persons, locations, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return persons.map((per, idx) => ({
        id: per.id,
        location: locations[idx][0]
      }))
    } else {
      return {
        id: persons.id,
        location: locations[0]
      }
    }
  }
)

export const personsPersonPrivileges = ormSelector(
  persons,
  orm.Person.personPrivileges,
  (_, idArg) => idArg,
  (persons, personPrivileges, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return persons.map((pers, idx) => ({
        id: pers.id,
        personPrivileges: personPrivileges[idx]
      }))
    } else {
      return {
        id: persons.id,
        personPrivileges: personPrivileges
      }
    }
  }
)

export const personDevices = ormSelector(
  (_, personId) => personId,
  orm,
  (personId, { Person }) => {
    const results = []
    if (!Person.idExists(personId)) return results
    Person.withId(personId).credentials.toModelArray().forEach(credential => {
      credential.devicePrivileges.toModelArray().forEach(devicePrivilege => {
        results.push({
          personSource: Person.withId(personId).ref,
          deviceTarget: devicePrivilege.device.ref
        })
      })
    })
    return results
  }
)

export const personNetTargetDevices = ormSelector(
  (_, personId) => personId,
  (state, personId) => personDevices(state, personId),
  orm,
  (personId, personDevices, { Device, Person }) => {
    const results = []
    if (!Person.idExists(personId)) return results
    personDevices.forEach(personDevice => {
      Device.withId(personDevice.deviceTarget.id).ifaces.toModelArray().forEach(ifaceSource => {
        ifaceSource.networkRoutesOutgoing.toModelArray().forEach(networkRoute => {
          networkRoute.networkServicesTarget.toRefArray().forEach(networkServiceTarget => {
            results.push({
              personSource: personDevice.personSource,
              deviceTarget: networkRoute.ifaceTarget.device.ref,
              networkService: networkServiceTarget
            })
          })
        })
      })
    })
    return results
  }
)

export const personsVulnerabilities = ormSelector(
  persons,
  orm.Person.humanVulnerabilities,
  (_, idArg) => idArg,
  (persons, humanVulnerabilities, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      const personsVulnerabilities = {}
      persons.forEach((pers, idx) => {
        const persVulnerabilities = {
          person: pers,
          humanVulnerabilities: Array.from(new Set(humanVulnerabilities[idx]))
        }
        personsVulnerabilities[pers.id] = persVulnerabilities
      })
      return personsVulnerabilities
    } else {
      const persVulnerabilities = {
        person: persons,
        humanVulnerabilities: Array.from(new Set(humanVulnerabilities))
      }
      return persVulnerabilities
    }
  }
)
