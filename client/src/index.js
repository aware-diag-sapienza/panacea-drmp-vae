import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { SnackbarProvider } from 'notistack'
import cytoscape from 'cytoscape'
import popper from 'cytoscape-popper'
import cxtmenu from 'cytoscape-cxtmenu'

import * as serviceWorker from './serviceWorker'

import theme from './theme'
import store from './store'

import App from './App'

axios.defaults.withCredentials = true
cytoscape.use(popper)
cytoscape.use(cxtmenu)

const SnackbarApp = () => <SnackbarProvider maxSnack={3}><App /></SnackbarProvider>
const Root = store.H.withProvider(theme.H.withTheme(SnackbarApp))
ReactDOM.render(<Root />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
