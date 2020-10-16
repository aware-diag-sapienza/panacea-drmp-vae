import theme from '../theme'
import { auth, users, snapshots, loaders, queries } from '../modules'
import schema from '../schema'

const reducer = {
  [schema.constants.NAME]: schema.reducer,
  [theme.constants.NAME]: theme.reducer,
  [auth.constants.NAME]: auth.reducer,
  [users.constants.NAME]: users.reducer,
  [snapshots.constants.NAME]: snapshots.reducer,
  [loaders.constants.NAME]: loaders.reducer,
  [queries.constants.NAME]: queries.reducer
}

export default reducer
