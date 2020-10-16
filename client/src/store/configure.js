import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import middleware from './middleware'
import theme from '../theme'
import { auth } from '../modules'
import socket from '../socket'
import reducer from './reducer'

const defaultMiddlewares = [
  ...getDefaultMiddleware({
    immutableCheck: {
      ignoredPaths: ['schema']
    },
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }),
  middleware.socket
]
const mw = process.env.NODE_ENV === 'production'
  ? [...defaultMiddlewares]
  : [...defaultMiddlewares, logger]

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [theme.constants.NAME, auth.constants.NAME]
}

const persistedReducer = persistReducer(persistConfig, combineReducers(reducer))

const configure = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: mw
  })
  const persistor = persistStore(store, null, () => {
    const state = store.getState()
    if (auth.selectors.isAuthenticated(state)) {
      store.dispatch(socket.actions.connect(state[auth.constants.NAME].session))
      store.dispatch(socket.actions.join('snapshots'))
      if (state[auth.constants.NAME].privileges.users) store.dispatch(socket.actions.join('users'))
    }
  })
  return { store, persistor }
}

export default configure
