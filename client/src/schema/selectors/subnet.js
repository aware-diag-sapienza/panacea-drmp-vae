import { createSelector as ormSelector } from 'redux-orm'

import orm from '../orm'

export const subnets = ormSelector(orm.Subnet)

export const subnetsIfaces = ormSelector(
  subnets,
  orm.Subnet.ifaces,
  (_, idArg) => idArg,
  (subnets, ifaces, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return subnets.map((sub, idx) => ({
        id: sub.id,
        ifaces: ifaces[idx]
      }))
    } else {
      return {
        id: subnets.id,
        ifaces: ifaces
      }
    }
  }
)
