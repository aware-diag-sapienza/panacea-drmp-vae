import { Model, attr, fk, many } from 'redux-orm'

class NetworkService extends Model {
  toString () {
    return `NetworkService: ${this.name}`
  }
}
NetworkService.modelName = 'NetworkService'
NetworkService.fields = {
  id: attr(),
  name: attr(),
  cpe: attr(),
  version: attr(),
  state: attr(),
  port: attr(),
  iface: fk({
    to: 'Iface',
    relatedName: 'networkServices'
  }),
  networkVulnerabilities: many({
    to: 'NetworkVulnerability',
    relatedName: 'networkServices'
  })
  // networkRoutesIncoming
  // networkExploitsIncoming
}

export default NetworkService
