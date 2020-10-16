import { Model, attr, fk } from 'redux-orm'

class Role extends Model {
  toString () {
    return `Role: ${this.position} @ ${this.department}`
  }
}
Role.modelName = 'Role'
Role.fields = {
  id: attr(),
  position: attr(),
  department: attr(),
  timeStart: attr(),
  timeEnd: attr(),
  person: fk({
    to: 'Person',
    relatedName: 'roles'
  })
}

export default Role
