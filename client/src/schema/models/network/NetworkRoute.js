import { Model, attr, fk, many } from 'redux-orm'

class NetworkRoute extends Model {
  toString () {
    return `NetworkRoute: ${this.id}`
  }
}
NetworkRoute.modelName = 'NetworkRoute'
NetworkRoute.fields = {
  id: attr(),
  ifaceSource: fk({
    to: 'Iface',
    relatedName: 'networkRoutesOutgoing'
  }),
  ifaceTarget: fk({
    to: 'Iface',
    relatedName: 'networkRoutesIncoming'
  }),
  networkServicesTarget: many({
    to: 'NetworkService',
    relatedName: 'networkRoutesIncoming'
  })
}

export default NetworkRoute
