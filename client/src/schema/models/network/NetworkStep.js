import { Model, attr, fk } from 'redux-orm'

class NetworkStep extends Model {
  toString () {
    return `NetworkStep: ${this.id}`
  }
}
NetworkStep.modelName = 'NetworkStep'
NetworkStep.fields = {
  id: attr(),
  devicePrivilegeSource: fk({
    to: 'DevicePrivilege',
    relatedName: 'networkStepsOutgoing'
  }),
  devicePrivilegeTarget: fk({
    to: 'DevicePrivilege',
    relatedName: 'networkStepsIncoming'
  })
  // networkExploits
}

export default NetworkStep
