import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Home, Graph, Lan, HospitalBox, ShieldAlert, AccountGroup } from 'mdi-material-ui'

import { auth, snapshots } from '../modules'

const ListItemLink = (props) => {
  const { to, icon, text } = props
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to]
  )
  return (
    <li>
      <ListItem button component={renderLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItem>
    </li>
  )
}

export default () => {
  const privileges = useSelector(auth.selectors.getPrivileges)
  const snapshotSelected = useSelector(snapshots.selectors.getSelected)
  const routes = [
    {
      key: 'home',
      to: '/',
      text: 'Home',
      icon: <Home />,
      visible: true
    },
    {
      key: 'topology',
      to: '/topology',
      text: 'Topology View',
      icon: <Lan />,
      visible: snapshotSelected && privileges.network
    },
    {
      key: 'human',
      to: '/human',
      text: 'Human View',
      icon: <AccountGroup />,
      visible: snapshotSelected && privileges.human
    },
    {
      key: 'dependencygraph',
      to: '/dependencygraph',
      text: 'Dependency Graph View',
      icon: <HospitalBox />,
      visible: snapshotSelected && privileges.business
    },
    {
      key: 'attackgraph',
      to: '/attackgraph',
      text: 'Attack Graph View',
      icon: <Graph />,
      visible: snapshotSelected && privileges.network
    },
    {
      key: 'riskanalysis',
      to: '/riskanalysis',
      text: 'Risk Analysis View',
      icon: <ShieldAlert />,
      visible: snapshotSelected && privileges.network && privileges.business
    }
  ]
  return (
    <List>
      {routes.filter(r => r.visible).map(r => (
        <ListItemLink key={r.key} to={r.to} icon={r.icon} text={r.text} />
      ))}
    </List>
  )
}
