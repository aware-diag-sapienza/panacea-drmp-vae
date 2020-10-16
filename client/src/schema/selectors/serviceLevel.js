import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export const serviceLevels = ormSelector(orm.ServiceLevel)
