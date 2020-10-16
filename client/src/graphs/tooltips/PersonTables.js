import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Popper, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import schema from '../../schema'
import { groupByObjects } from '../../utils'
import { TablePlain, TableList } from '../../components'
import withNestedTip from './withNestedTip'

const useStyles = makeStyles(theme => ({
  popper: {
    zIndex: theme.zIndex.tooltip + 1
  }
}))

export const SelectedReachableServices = ({ id, ...other }) => {
  const personNetTargetDevices = useSelector(state => schema.selectors.personNetTargetDevices(state, id)).map(s => ({ target: s.deviceTarget.name, service: s.networkService.name }))
  const columns = [
    { title: 'Reachable Service', field: 'service' },
    { title: 'Producers', field: 'producers' }
  ]
  const deviceNetTargets = groupByObjects(personNetTargetDevices, 'service')
  const data = Object.entries(deviceNetTargets).map(t => {
    return {
      key: t[0],
      service: t[0],
      producers: t[1].map(e => e.target).join(', ')
    }
  })
  return (
    <TablePlain
      columns={columns}
      data={data}
      size='small'
      {...other}
    />
  )
}

export const ReachableServices = ({ id, selectedId, ...other }) => {
  const deviceNetSourcePersons = useSelector(state => schema.selectors.deviceNetSourcePersons(state, selectedId))
    .map(s => ({ service: s.networkService.name, sourceId: s.personSource.id }))
    .filter(e => e.sourceId === id)
  if (deviceNetSourcePersons.length === 0) return (null)
  const columns = [
    { title: 'Reachable Services', field: 'service' }
  ]
  const data = deviceNetSourcePersons.map(s => ({ key: s.service, service: s.service }))
  return (
    <TablePlain
      columns={columns}
      data={data}
      size='small'
      {...other}
    />
  )
}

export const Vulnerability = ({ id, ...other }) => {
  const vulnerability = useSelector(state => schema.selectors.humanVulnerabilities(state, id))
  const data = [
    { key: 'ac', title: 'Attack Complexity', value: vulnerability.impact.attackComplexity },
    { key: 'ii', title: 'Identity Impact', value: vulnerability.impact.identityImpact }
  ]
  return (
    <Paper {...other}>
      <Typography variant='body2'>{vulnerability.description}</Typography>
      <TableList data={data} size='small' />
    </Paper>
  )
}

export const Vulnerabilities = ({ id, ...other }) => {
  const personVulnerabilities = useSelector(state => schema.selectors.personsVulnerabilities(state, id))
  const classes = useStyles()
  const [currentVulnerability, setCurrentVulnerability] = useState({ id: null, anchor: null })
  const columns = [
    { title: 'Vulnerability', field: 'vulnerability' },
    { title: 'Precondition', field: 'precondition' },
    { title: 'Postcondition', field: 'postcondition' }
  ]
  const data = []
  personVulnerabilities.humanVulnerabilities.forEach(vuln => data.push(
    {
      key: vuln.id,
      vulnerability: vuln.name,
      precondition: vuln.preCondition,
      postcondition: vuln.postCondition,
      rowProps: {
        onClick: event => setCurrentVulnerability({ id: vuln.id, anchor: event.target }),
        onMouseLeave: () => setCurrentVulnerability({ id: null, anchor: null })
      }
    }
  ))
  const Tip = withNestedTip(Vulnerability)
  return (
    <>
      <TablePlain
        columns={columns}
        data={data}
        width={500}
        height={120}
        widthColumns={[50, 25, 25]}
        size='small'
        {...other}
      />
      <Popper className={classes.popper} open={currentVulnerability.anchor !== null} anchorEl={currentVulnerability.anchor}>
        <Tip id={currentVulnerability.id} {...other} />
      </Popper>
    </>
  )
}

export const AttackPaths = ({ id, queryResults, ...other }) => {
  const data = []
  if (queryResults && queryResults.nodes[id] !== undefined) {
    data.push({ key: 'paths', title: 'Number of paths', value: queryResults.nodes[id].numPaths })
    data.push({ key: 'source', title: 'Source', value: queryResults.nodes[id].numSource })
    data.push({ key: 'middle', title: 'Intermediate node', value: queryResults.nodes[id].numMiddle })
    data.push({ key: 'target', title: 'Target', value: queryResults.nodes[id].numTarget })
    return (
      <Paper {...other}>
        <TableList data={data} size='small' />
      </Paper>
    )
  } else return null
}
