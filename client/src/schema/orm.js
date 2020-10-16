import { ORM } from 'redux-orm'
import {
  NetworkVulnerability, Device, LocalService, Subnet, Iface, NetworkService, NetworkRoute, DevicePrivilege, NetworkStep, NetworkExploit,
  HumanVulnerability, Role, Location, Person, PersonPrivilege, HumanStep, HumanExploit,
  Credential, InterStep,
  BusinessEntity, BusinessEntityType, ServiceDependency, ServiceLevel
} from './models'
import { NAME } from './constants'

const orm = new ORM({
  stateSelector: state => state[NAME]
})
orm.register(
  NetworkVulnerability, Device, LocalService, Subnet, Iface, NetworkService, NetworkRoute, DevicePrivilege, NetworkStep, NetworkExploit,
  HumanVulnerability, Role, Location, Person, PersonPrivilege, HumanStep, HumanExploit,
  Credential, InterStep,
  BusinessEntity, BusinessEntityType, ServiceDependency, ServiceLevel
)

export default orm
