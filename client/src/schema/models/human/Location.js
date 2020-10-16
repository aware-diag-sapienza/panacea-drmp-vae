import { Model, attr } from 'redux-orm'

class Location extends Model {
  toString () {
    return `Location: ${this.id}`
  }
}
Location.modelName = 'Location'
Location.fields = {
  id: attr(),
  building: attr(),
  floor: attr(),
  corridor: attr(),
  room: attr()
  // persons
}

export default Location
