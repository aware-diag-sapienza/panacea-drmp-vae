import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export const networkRoutes = ormSelector(orm.NetworkRoute)

export const networkRoutesDevicesOutgoing = ormSelector(orm.NetworkRoute.ifaceTarget.device)

export const networkRoutesDevicesIncoming = ormSelector(orm.NetworkRoute.ifaceSource.device)
