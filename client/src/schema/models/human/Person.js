import { Model, attr, many } from 'redux-orm'

class Person extends Model {
  toString () {
    return `${this.name}`
  }
}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  name: attr(),
  affiliation: attr(),
  locations: many({
    to: 'Location',
    relatedName: 'persons'
  }),
  humanVulnerabilities: many({
    to: 'HumanVulnerability',
    relatedName: 'persons'
  })
  // roles
  // personPrivileges
  // credentials
}

export default Person
