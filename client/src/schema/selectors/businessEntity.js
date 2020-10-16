import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export const businessEntities = ormSelector(orm.BusinessEntity)

export const businessEntitiesServiceLevels = ormSelector(
  businessEntities,
  orm.BusinessEntity.serviceLevels,
  (_, idArg) => idArg,
  (businessEntities, serviceLevels, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return businessEntities.map((be, idx) => ({
        id: be.id,
        serviceLevels: serviceLevels[idx]
      }))
    } else {
      return {
        id: businessEntities.id,
        serviceLevels: serviceLevels
      }
    }
  }
)
