import { Model, attr } from 'redux-orm'

class BusinessEntityType extends Model {
  toString () {
    return `${this.id}`
  }
}
BusinessEntityType.modelName = 'BusinessEntityType'
BusinessEntityType.fields = {
  id: attr()
  // businessEntities
}

export default BusinessEntityType
