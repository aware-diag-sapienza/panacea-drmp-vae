import orm from './orm'

import { loadNetwork, loadHuman, loadInter, loadBusiness, loadBusinessMapping } from './actions'

const reducer = (slice, action) => {
  const session = orm.session(slice)
  const {
    NetworkVulnerability, Device, LocalService, Subnet, Iface, NetworkService, NetworkRoute, DevicePrivilege, NetworkStep, NetworkExploit,
    HumanVulnerability, Role, Location, Person, PersonPrivilege, HumanStep, HumanExploit,
    Credential, InterStep,
    BusinessEntityType, BusinessEntity, ServiceLevel, ServiceDependency
  } = session
  switch (action.type) {
    case loadNetwork.type:
      console.log(action.payload.network)
      action.payload.network.networkVulnerabilities.forEach(networkVulnerability => NetworkVulnerability.create(networkVulnerability))
      action.payload.network.devices.forEach(device => Device.create(device))
      action.payload.network.localServices.forEach(localService => LocalService.create(localService))
      action.payload.network.subnets.forEach(subnet => Subnet.create(subnet))
      action.payload.network.ifaces.forEach(iface => Iface.create(iface))
      action.payload.network.networkServices.forEach(networkService => NetworkService.create(networkService))
      action.payload.network.networkRoutes.forEach(networkRoute => NetworkRoute.create(networkRoute))
      // TODO: fix immutability issues if serviceLevel is not instantiated
      action.payload.network.devicePrivileges.forEach(devicePrivilege => DevicePrivilege.create({ ...devicePrivilege, serviceLevel: null }))
      action.payload.network.networkSteps.forEach(networkStep => NetworkStep.create(networkStep))
      action.payload.network.networkExploits.forEach(networkExploit => NetworkExploit.create(networkExploit))
      break
    case loadHuman.type:
      console.log(action.payload.human)
      action.payload.human.humanVulnerabilities.forEach(humanVulnerability => HumanVulnerability.create(humanVulnerability))
      action.payload.human.roles.forEach(role => Role.create(role))
      action.payload.human.locations.forEach(location => Location.create(location))
      action.payload.human.persons.forEach(person => Person.create(person))
      action.payload.human.personPrivileges.forEach(personPrivilege => PersonPrivilege.create(personPrivilege))
      action.payload.human.humanSteps.forEach(humanStep => HumanStep.create(humanStep))
      action.payload.human.humanExploits.forEach(humanExploit => HumanExploit.create(humanExploit))
      break
    case loadInter.type:
      console.log(action.payload.inter)
      // TODO: ask rhea to solve the warning about missing devices
      action.payload.inter.credentials.forEach(credential => {
        credential.devicePrivileges = credential.devicePrivileges.filter(dp => DevicePrivilege.idExists(dp))
        Credential.create(credential)
      })
      action.payload.inter.interSteps.filter(interStep => DevicePrivilege.idExists(interStep.devicePrivilegeTarget)).forEach(interStep => InterStep.create(interStep))
      break
    case loadBusiness.type:
      console.log(action.payload.business)
      action.payload.business.businessEntityTypes.forEach(businessEntityType => BusinessEntityType.create(businessEntityType))
      action.payload.business.businessEntities.forEach(businessEntity => BusinessEntity.create(businessEntity))
      action.payload.business.serviceLevels.forEach(serviceLevel => ServiceLevel.create(serviceLevel))
      action.payload.business.serviceDependencies.forEach(serviceDependency => ServiceDependency.create(serviceDependency))
      break
    case loadBusinessMapping.type:
      action.payload.businessMapping.devicePrivileges.forEach(devicePrivilegeEntry => {
        if (DevicePrivilege.idExists(devicePrivilegeEntry.devicePrivilegeId)) DevicePrivilege.withId(devicePrivilegeEntry.devicePrivilegeId).serviceLevel = devicePrivilegeEntry.serviceLevel
      })
      break
    default:
      break
  }
  return session.state
}

export default reducer
