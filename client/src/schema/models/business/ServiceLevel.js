import { Model, attr, fk } from 'redux-orm'

class ServiceLevel extends Model {
  toString () {
    return `${this.id}`
  }
}
ServiceLevel.modelName = 'ServiceLevel'
ServiceLevel.fields = {
  id: attr(),
  confidentialityLevel: attr(),
  integrityLevel: attr(),
  availabilityLevel: attr(),
  impact: attr(),
  businessEntity: fk({
    to: 'BusinessEntity',
    relatedName: 'serviceLevels'
  })
  // serviceDependencies
  // serviceDependenciesChildren
  // devicePrivileges
}

export default ServiceLevel
