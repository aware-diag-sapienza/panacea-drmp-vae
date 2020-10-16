import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export const info = ormSelector(
  orm,
  (session) => {
    return [
      {
        entities: 'Devices', number: session.Device.all().toModelArray().length
      },
      {
        entities: 'Networks', number: session.Subnet.all().toModelArray().length
      },
      {
        entities: 'Network Vulnerabilities', number: session.NetworkVulnerability.all().toModelArray().length
      },
      // TODO: fix number of employees!!!
      {
        entities: 'Employees', number: session.Person.all().toModelArray().length - 1
      },
      {
        entities: 'Human Vulnerabilities', number: session.HumanVulnerability.all().toModelArray().length
      }
    ]
  }
)
