import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export { devices } from './device'
export { devicesIfaces } from './device'
export { devicesDevicePrivileges } from './device'
export { devicesLocalServices } from './device'
export { devicesNetworkServices } from './device'
export { devicesOsVulnerabilities } from './device'
export { devicesLocalVulnerabilities } from './device'
export { devicesNetworkVulnerabilities } from './device'
export { devicesVulnerabilities } from './device'
export { devicesNetworkRoutesOutgoing } from './device'
export { devicesNetworkRoutesIncoming } from './device'
export { deviceNetTargetDevices } from './device'
export { deviceNetSourceDevices } from './device'
export { deviceNetSourcePersons } from './device'
export { deviceAttTargetDevices } from './device'
export { deviceAttSourceDevices } from './device'
export { deviceAttSourcePersons } from './device'

export { subnets } from './subnet'
export { subnetsIfaces } from './subnet'

export { networkRoutes } from './networkRoute'
export { networkRoutesDevicesOutgoing } from './networkRoute'
export { networkRoutesDevicesIncoming } from './networkRoute'

export { persons } from './person'
export { personsType } from './person'
export { personsLocation } from './person'
export { personDevices } from './person'
export { personNetTargetDevices } from './person'
export { personsPersonPrivileges } from './person'
export { personsVulnerabilities } from './person'

export { credentials } from './credential'
export { credentialsPerson } from './credential'
export { credentialsDevicePrivileges } from './credential'
export { credentialsPersonDevicePrivileges } from './credential'

export { businessEntities } from './businessEntity'
export { businessEntitiesServiceLevels } from './businessEntity'

export { serviceLevels } from './serviceLevel'

export { info } from './stats'

export const networkVulnerabilities = ormSelector(orm.NetworkVulnerability)
export const localServices = ormSelector(orm.LocalService)
export const ifaces = ormSelector(orm.Iface)
export const networkServices = ormSelector(orm.NetworkService)

export const humanVulnerabilities = ormSelector(orm.HumanVulnerability)

export const interSteps = ormSelector(orm.InterStep)

export const serviceDependencies = ormSelector(orm.ServiceDependency)
