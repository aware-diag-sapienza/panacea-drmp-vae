import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, IconButton, Collapse, Badge } from '@material-ui/core'
import { ExpansionCardVariant, Console, ConsoleNetwork } from 'mdi-material-ui'

import schema from '../../schema'
import { icons } from '../../encodings'
import { Ifaces, LocalServices, NetworkServices, SelectedProvidedServices, SelectedReachableServices, ProvidedServices, ReachableServices, Vulnerabilities, AttackPaths } from './DeviceTables'

const DeviceTip = (props) => {
  const { id, context, selectedId, queryResults } = props
  const device = useSelector(state => schema.selectors.devices(state, id))
  const localServices = useSelector(state => schema.selectors.devicesLocalServices(state, id)).localServices
  const ifaces = useSelector(state => schema.selectors.devicesIfaces(state, id)).ifaces
  const networkServices = useSelector(state => schema.selectors.devicesNetworkServices(state, id)).networkServices
  const selected = id === selectedId
  const [expanded, setExpanded] = React.useState(false)
  return (
    <Card variant='outlined'>
      <CardHeader
        avatar={
          <Avatar variant='square' src={icons.devicesTypes.img[device.type]} />
        }
        title={device.name}
        subheader={device.type}
      />
      <CardContent>
        <Typography>
          {`${device.operatingSystem.vendor} - ${device.operatingSystem.family} - ${device.operatingSystem.generation}`}
        </Typography>
        {context === 'AttackGraph' && <Vulnerabilities id={id} size='small' />}
        {context === 'AttackGraph' && <div style={{ width: '50%', margin: 'auto', marginTop: '16px' }}><AttackPaths id={id} queryResults={queryResults} size='small' style={{ paddingTop: 8 }} /></div>}
        {context === 'Topology' && selected &&
          <>
            <SelectedProvidedServices id={id} size='small' />
            <SelectedReachableServices id={id} size='small' />
          </>}
        {context === 'Topology' && !selected &&
          <>
            <ProvidedServices id={id} selectedId={selectedId} size='small' />
            <ReachableServices id={id} selectedId={selectedId} size='small' />
          </>}
      </CardContent>
      <CardActions>
        <IconButton
          onMouseOver={() => setExpanded('localServices')}
          aria-label='local services'
        >
          <Badge badgeContent={localServices.length} color='primary' invisible={localServices.length === 0}>
            <Console />
          </Badge>
        </IconButton>
        <IconButton
          onMouseOver={() => setExpanded('ifaces')}
          aria-label='interfaces'
        >
          <Badge badgeContent={ifaces.length} color='primary' invisible={ifaces.length === 0}>
            <ExpansionCardVariant />
          </Badge>
        </IconButton>
        <IconButton
          onMouseOver={() => setExpanded('networkServices')}
          aria-label='network services'
        >
          <Badge badgeContent={networkServices.length} color='primary' invisible={networkServices.length === 0}>
            <ConsoleNetwork />
          </Badge>
        </IconButton>
      </CardActions>
      <Collapse in={expanded !== false} timeout='auto' unmountOnExit>
        <CardContent>
          {expanded === 'localServices' && <LocalServices id={id} size='small' />}
          {expanded === 'ifaces' && <Ifaces id={id} size='small' />}
          {expanded === 'networkServices' && <NetworkServices id={id} size='small' />}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default DeviceTip
