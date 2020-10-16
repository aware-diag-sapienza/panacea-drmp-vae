import { Model, attr, fk } from 'redux-orm'

class PersonPrivilege extends Model {
  toString () {
    return `PersonPrivilege: ${this.id}`
  }
}
PersonPrivilege.modelName = 'PersonPrivilege'
PersonPrivilege.fields = {
  id: attr(),
  level: attr(),
  person: fk({
    to: 'Person',
    relatedName: 'personPrivileges'
  })
  // humanStepsOutgoing
  // humanStepsIncoming
  // interStepsOutgoing
}

export default PersonPrivilege
