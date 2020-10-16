import { Model, attr, fk } from 'redux-orm'

class InterStep extends Model {
  toString () {
    return `InterStep: ${this.id}`
  }
}
InterStep.modelName = 'InterStep'
InterStep.fields = {
  id: attr(),
  credential: fk({
    to: 'Credential',
    relatedName: 'interSteps'
  }),
  personPrivilegeSource: fk({
    to: 'PersonPrivilege',
    relatedName: 'interStepsOutgoing'
  }),
  devicePrivilegeTarget: fk({
    to: 'DevicePrivilege',
    relatedName: 'interStepsIncoming'
  })
}

export default InterStep
