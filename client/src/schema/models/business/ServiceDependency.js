import { Model, attr, fk } from 'redux-orm'

class ServiceDependency extends Model {
  toString () {
    return `${this.id}`
  }
}
ServiceDependency.modelName = 'ServiceDependency'
ServiceDependency.fields = {
  id: attr(),
  type: attr(),
  serviceLevel: fk({
    to: 'ServiceLevel',
    relatedName: 'serviceDependencies'
  }),
  serviceLevelParent: fk({
    to: 'ServiceLevel',
    relatedName: 'serviceDependenciesChildren'
  }),
  serviceDependencyParent: fk({
    to: 'ServiceDependency',
    relatedName: 'serviceDependenciesChildren'
  })
  // serviceDependenciesChildren
}

export default ServiceDependency
