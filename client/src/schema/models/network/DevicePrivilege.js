import { Model, attr, fk } from 'redux-orm'

class DevicePrivilege extends Model {
  toString () {
    return `DevicePrivilege: ${this.name}`
  }
}
DevicePrivilege.modelName = 'DevicePrivilege'
DevicePrivilege.fields = {
  id: attr(),
  name: attr(),
  level: attr(),
  position: attr(),
  device: fk({
    to: 'Device',
    relatedName: 'devicePrivileges'
  }),
  serviceLevel: fk({
    to: 'ServiceLevel',
    relatedName: 'devicePrivileges'
  })
  // networkStepsOutgoing
  // networkStepsIncoming
  // credentials
  // interStepsIncoming
}

export default DevicePrivilege
