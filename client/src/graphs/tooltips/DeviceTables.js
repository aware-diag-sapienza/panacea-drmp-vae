import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Popper, Paper } from '@material-ui/core'
import { ConsoleLine, Console, ConsoleNetwork } from 'mdi-material-ui'
import { makeStyles } from '@material-ui/core/styles'

import schema from '../../schema'
import { groupByObjects } from '../../utils'
import { TablePlain, TableList } from '../../components'
import withNestedTip from './withNestedTip'
// import { getSelectedRoutesSources, getSelectedRoutesTargets } from '../selectors'

const useStyles = makeStyles(theme => ({
  popper: {
    zIndex: theme.zIndex.tooltip + 1
  }
}))

export const Ifaces = ({ id, ...other }) => {
  const ifaces = useSelector(state => schema.selectors.devicesIfaces(state, id)).ifaces
  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'IPv', field: 'ipv' },
    { title: 'IP', field: 'ip' },
    { title: 'Subnet', field: 'subnet' }
  ]
  const data = ifaces.map(iface => ({
    key: iface.id,
    name: iface.name,
    ipv: iface.ip.version,
    ip: iface.ip.address,
    subnet: iface.subnet
  }))
  return (
    <TablePlain
      columns={columns}
      data={data}
      width={500}
      height={120}
      widthColumns={[20, 10, 35, 35]}
      size='small'
      {...other}
    />
  )
}

export const LocalServices = ({ id, ...other }) => {
  const localServices = useSelector(state => schema.selectors.devicesLocalServices(state, id)).localServices
  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Version', field: 'version' },
    { title: 'CPE', field: 'cpe' }
  ]
  const data = localServices.map(localService => ({
    key: localService.id,
    name: localService.name,
    version: localService.version,
    cpe: localService.cpe
  }))
  return (
    <TablePlain
      columns={columns}
      data={data}
      width={500}
      height={120}
      widthColumns={[40, 10, 50]}
      size='small'
      {...other}
    />
  )
}

export const NetworkServices = ({ id, ...other }) => {
  const networkServices = useSelector(state => schema.selectors.devicesNetworkServices(state, id)).networkServices
  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Version', field: 'version' },
    { title: 'CPE', field: 'cpe' },
    { title: 'Port', field: 'port' },
    { title: 'Status', field: 'status' }
  ]
  const data = networkServices.map(networkService => ({
    key: networkService.id,
    name: networkService.name,
    version: networkService.version,
    cpe: networkService.cpe,
    port: `${networkService.port.number}/${networkService.port.transport}`,
    status: networkService.state === 'Running'
      ? networkService.port.state === 'open'
        ? 'Running'
        : 'Blocked'
      : 'Off'
  }))
  return (
    <TablePlain
      columns={columns}
      data={data}
      width={500}
      height={120}
      widthColumns={[30, 15, 30, 15, 15]}
      size='small'
      {...other}
    />
  )
}

export const SelectedProvidedServices = ({ id, ...other }) => {
  const deviceNetSourceDevices = useSelector(state => schema.selectors.deviceNetSourceDevices(state, id)).map(s => ({ source: s.deviceSource.name, service: s.networkService.name }))
  const deviceNetSourcePersons = useSelector(state => schema.selectors.deviceNetSourcePersons(state, id)).map(s => ({ source: s.personSource.name, service: s.networkService.name }))
  const columns = [
    { title: 'Provided Service', field: 'service' },
    { title: 'Consumers', field: 'consumers' }
  ]
  const deviceNetSources = groupByObjects(deviceNetSourceDevices.concat(deviceNetSourcePersons), 'service')
  const data = Object.entries(deviceNetSources).map(s => {
    return {
      key: s[0],
      service: s[0],
      consumers: s[1].map(e => e.source).join(', ')
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

export const SelectedReachableServices = ({ id, ...other }) => {
  const deviceNetTargetDevices = useSelector(state => schema.selectors.deviceNetTargetDevices(state, id)).map(s => ({ target: s.deviceTarget.name, service: s.networkService.name }))
  const columns = [
    { title: 'Reachable Service', field: 'service' },
    { title: 'Producers', field: 'producers' }
  ]
  const deviceNetTargets = groupByObjects(deviceNetTargetDevices, 'service')
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

export const ProvidedServices = ({ id, selectedId, ...other }) => {
  const deviceNetTargetDevices = useSelector(state => schema.selectors.deviceNetTargetDevices(state, selectedId))
    .map(s => ({ service: s.networkService.name, targetId: s.deviceTarget.id }))
    .filter(e => e.targetId === id)
  const personNetTargetDevices = useSelector(state => schema.selectors.personNetTargetDevices(state, selectedId))
    .map(s => ({ service: s.networkService.name, targetId: s.deviceTarget.id }))
    .filter(e => e.targetId === id)
  const targetDevices = [...deviceNetTargetDevices, ...personNetTargetDevices]
  if (targetDevices.length === 0) return (null)
  const columns = [
    { title: 'Provided Services', field: 'service' }
  ]
  const data = targetDevices.map(t => ({ key: t.service, service: t.service }))
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
  const deviceNetSourceDevices = useSelector(state => schema.selectors.deviceNetSourceDevices(state, selectedId))
    .map(s => ({ service: s.networkService.name, sourceId: s.deviceSource.id }))
    .filter(e => e.sourceId === id)
  if (deviceNetSourceDevices.length === 0) return (null)
  const columns = [
    { title: 'Reachable Services', field: 'service' }
  ]
  const data = deviceNetSourceDevices.map(s => ({ key: s.service, service: s.service }))
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
  const vulnerability = useSelector(state => schema.selectors.networkVulnerabilities(state, id))
  const data = []
  if (vulnerability.impactV3) {
    data.push({ key: 'cvs', title: 'CVSS Version', value: 3 })
    data.push({ key: 'con', title: 'Confidentiality Impact', value: vulnerability.impactV3.ciaImpacts.filter(i => i.type === 'Confidentiality')[0].impact })
    data.push({ key: 'int', title: 'Integrity Impact', value: vulnerability.impactV3.ciaImpacts.filter(i => i.type === 'Integrity')[0].impact })
    data.push({ key: 'ava', title: 'Availability Impact', value: vulnerability.impactV3.ciaImpacts.filter(i => i.type === 'Availability')[0].impact })
    data.push({ key: 'avs', title: 'Attack Vector Score', value: vulnerability.impactV3.attackVectorScore })
    data.push({ key: 'ac', title: 'Attack Complexity', value: vulnerability.impactV3.attackComplexity })
    data.push({ key: 'ui', title: 'User Interaction', value: vulnerability.impactV3.userInteraction })
    data.push({ key: 'es', title: 'Exploitability Score', value: vulnerability.impactV3.exploitabilityScore })
    data.push({ key: 'is', title: 'Impact Score', value: vulnerability.impactV3.impactScore })
  } else if (vulnerability.impactV2) {
    data.push({ key: 'cvs', title: 'CVSS Version', value: 2 })
    data.push({ key: 'con', title: 'Confidentiality Impact', value: vulnerability.impactV2.ciaImpacts.filter(i => i.type === 'Confidentiality')[0].impact })
    data.push({ key: 'int', title: 'Integrity Impact', value: vulnerability.impactV2.ciaImpacts.filter(i => i.type === 'Integrity')[0].impact })
    data.push({ key: 'ava', title: 'Availability Impact', value: vulnerability.impactV2.ciaImpacts.filter(i => i.type === 'Availability')[0].impact })
    data.push({ key: 'avs', title: 'Access Vector Score', value: vulnerability.impactV2.accessVectorScore })
    data.push({ key: 'ac', title: 'Access Complexity', value: vulnerability.impactV2.accessComplexity })
    data.push({ key: 'ui', title: 'User Interaction', value: vulnerability.impactV2.userInteractionRequired ? 'Yes' : 'No' })
    data.push({ key: 'es', title: 'Exploitability Score', value: vulnerability.impactV2.exploitabilityScore })
    data.push({ key: 'is', title: 'Impact Score', value: vulnerability.impactV2.impactScore })
  }
  return (
    <Paper {...other}>
      <TableList data={data} size='small' />
    </Paper>
  )
}

export const Vulnerabilities = ({ id, ...other }) => {
  const deviceVulnerabilities = useSelector(state => schema.selectors.devicesVulnerabilities(state, id))
  const classes = useStyles()
  const [currentVulnerability, setCurrentVulnerability] = useState({ id: null, anchor: null })
  const columns = [
    { title: 'Type', field: 'type' },
    { title: 'CVE', field: 'cve' },
    { title: 'Precondition', field: 'precondition' },
    { title: 'Postcondition', field: 'postcondition' }
  ]
  const data = []
  const localVulnerabilities = deviceVulnerabilities.localVulnerabilities.filter(lv => deviceVulnerabilities.osVulnerabilities.map(ov => ov.id).indexOf(lv.id) < 0)
  const networkVulnerabilities = deviceVulnerabilities.networkVulnerabilities
    .filter(nv => deviceVulnerabilities.osVulnerabilities.map(ov => ov.id).indexOf(nv.id) < 0)
    .filter(nv => localVulnerabilities.map(lv => lv.id).indexOf(nv.id) < 0)
  deviceVulnerabilities.osVulnerabilities.forEach(vuln => data.push(
    {
      type: <ConsoleLine />,
      key: vuln.id,
      cve: vuln.name,
      precondition: vuln.preCondition,
      postcondition: vuln.postCondition,
      rowProps: {
        onClick: event => setCurrentVulnerability({ id: vuln.id, anchor: event.target }),
        onMouseLeave: () => setCurrentVulnerability({ id: null, anchor: null })
      }
    }
  ))
  localVulnerabilities.forEach(vuln => data.push(
    {
      type: <Console />,
      key: vuln.id,
      cve: vuln.name,
      precondition: vuln.preCondition,
      postcondition: vuln.postCondition,
      rowProps: {
        onClick: event => setCurrentVulnerability({ id: vuln.id, anchor: event.target }),
        onMouseLeave: () => setCurrentVulnerability({ id: null, anchor: null })
      }
    }
  ))
  networkVulnerabilities.forEach(vuln => data.push(
    {
      type: <ConsoleNetwork />,
      key: vuln.id,
      cve: vuln.name,
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
        widthColumns={[10, 40, 25, 25]}
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
