import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { auth, snapshots } from '../modules'
import Activate from './Activate'
import Home from './Home'
import Login from './Login'
import Users from './Users'
import Human from './Human'
import Topology from './Topology'
import AttackGraph from './AttackGraph'
import Welcome from './Welcome'
import DependencyGraph from './DependencyGraph'
import RiskAnalysis from './RiskAnalysis'

const Router = () => {
  const isAuthenticated = useSelector(auth.selectors.isAuthenticated)
  const usersPrivilege = useSelector(auth.selectors.usersPrivilege)
  const networkPrivilege = useSelector(auth.selectors.networkPrivilege)
  const humanPrivilege = useSelector(auth.selectors.humanPrivilege)
  const businessPrivilege = useSelector(auth.selectors.businessPrivilege)
  const selectedSnapshot = useSelector(snapshots.selectors.getSelected)
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          {isAuthenticated
            ? <Home />
            : <Welcome />}
        </Route>
        <Route path='/login' exact>
          {isAuthenticated
            ? <Redirect to='/' />
            : <Login />}
        </Route>
        <Route path='/activate' exact>
          <Activate />
        </Route>
        <Route path='/users' exact>
          {isAuthenticated && usersPrivilege
            ? <Users />
            : <Redirect to='/' />}
        </Route>
        <Route path='/topology' exact>
          {isAuthenticated && selectedSnapshot !== null
            ? <Topology />
            : <Redirect to='/' />}
        </Route>
        <Route path='/human' exact>
          {isAuthenticated && humanPrivilege && selectedSnapshot !== null
            ? <Human />
            : <Redirect to='/' />}
        </Route>
        <Route path='/attackgraph' exact>
          {isAuthenticated && networkPrivilege && selectedSnapshot !== null
            ? <AttackGraph />
            : <Redirect to='/' />}
        </Route>
        <Route path='/dependencygraph' exact>
          {isAuthenticated && businessPrivilege && selectedSnapshot !== null
            ? <DependencyGraph />
            : <Redirect to='/' />}
        </Route>
        <Route path='/riskanalysis' exact>
          {isAuthenticated && businessPrivilege && networkPrivilege && selectedSnapshot !== null
            ? <RiskAnalysis />
            : <Redirect to='/' />}
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
