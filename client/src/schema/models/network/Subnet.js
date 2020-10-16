import { Model, attr } from 'redux-orm'

class Subnet extends Model {
  toString () {
    return `${this.name}`
  }
}
Subnet.modelName = 'Subnet'
Subnet.fields = {
  id: attr(),
  name: attr(),
  address: attr(),
  mask: attr(),
  maskLength: attr(),
  maxNumHosts: attr(),
  position: attr()
  // ifaces
}

export default Subnet
