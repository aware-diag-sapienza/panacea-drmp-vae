import { Model, attr, fk, many } from 'redux-orm'

class LocalService extends Model {
  toString () {
    return `LocalService: ${this.name}`
  }
}
LocalService.modelName = 'LocalService'
LocalService.fields = {
  id: attr(),
  name: attr(),
  cpe: attr(),
  version: attr(),
  device: fk({
    to: 'Device',
    relatedName: 'localServices'
  }),
  networkVulnerabilities: many({
    to: 'NetworkVulnerability',
    relatedName: 'localServices'
  })
}

export default LocalService
