import { Model, attr, many } from 'redux-orm'

class Device extends Model {
  toString () {
    return this.name
  }
}
Device.modelName = 'Device'
Device.fields = {
  id: attr(),
  name: attr(),
  type: attr(),
  operatingSystem: attr(),
  position: attr(),
  networkVulnerabilities: many({
    to: 'NetworkVulnerability',
    relatedName: 'devices'
  })
  // localServices
  // ifaces
  // devicePrivileges
}

export default Device
