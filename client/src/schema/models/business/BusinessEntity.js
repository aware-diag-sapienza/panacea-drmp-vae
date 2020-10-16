import { Model, attr, fk } from 'redux-orm'

class BusinessEntity extends Model {
  toString () {
    return `${this.name}`
  }
}
BusinessEntity.modelName = 'BusinessEntity'
BusinessEntity.fields = {
  id: attr(),
  name: attr(),
  businessEntityType: fk({
    to: 'BusinessEntityType',
    relatedName: 'businessEntities'
  })
  // serviceLevels
}

export default BusinessEntity
