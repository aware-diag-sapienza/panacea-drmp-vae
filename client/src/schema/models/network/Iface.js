import { Model, attr, fk } from 'redux-orm'

class Iface extends Model {
  toString () {
    return `Iface: ${this.name}`
  }
}
Iface.modelName = 'Iface'
Iface.fields = {
  id: attr(),
  name: attr(),
  mac: attr(),
  ip: attr(),
  device: fk({
    to: 'Device',
    relatedName: 'ifaces'
  }),
  subnet: fk({
    to: 'Subnet',
    relatedName: 'ifaces'
  })
  // networkServices
  // networkRoutesOutgoing
  // networkRoutesIncoming
  // networkExploitsOutgoing
  // networkExploitsIncoming
}

export default Iface
