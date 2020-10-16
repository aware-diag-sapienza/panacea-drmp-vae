import { Model, attr, fk } from 'redux-orm'

class HumanStep extends Model {
  toString () {
    return `HumanStep: ${this.id}`
  }
}
HumanStep.modelName = 'HumanStep'
HumanStep.fields = {
  id: attr(),
  personPrivilegeSource: fk({
    to: 'PersonPrivilege',
    relatedName: 'humanStepsOutgoing'
  }),
  personPrivilegeTarget: fk({
    to: 'PersonPrivilege',
    relatedName: 'humanStepsIncoming'
  })
  // humanExploits
}

export default HumanStep
