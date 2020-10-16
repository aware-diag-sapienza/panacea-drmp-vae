import { Model, attr, fk, many } from 'redux-orm'

class Credential extends Model {
  toString () {
    return `Credential: ${this.id}`
  }
}
Credential.modelName = 'Credential'
Credential.fields = {
  id: attr(),
  type: attr(),
  person: fk({
    to: 'Person',
    relatedName: 'credentials'
  }),
  devicePrivileges: many({
    to: 'DevicePrivilege',
    relatedName: 'credentials'
  })
  // interSteps
}

export default Credential
