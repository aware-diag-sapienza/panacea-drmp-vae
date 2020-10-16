import React from 'react'
import { Provider } from 'react-redux'
// import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import configure from '../configure'

const { store, persistor } = configure()

const withProvider = (Component) => {
  const WithProvider = (props) => (
    <Provider store={store}>
      <PersistGate loading={<div>ciao</div>} persistor={persistor}>
        <Component {...props} />
      </PersistGate>
    </Provider>
  )
  return WithProvider
}

export default withProvider
