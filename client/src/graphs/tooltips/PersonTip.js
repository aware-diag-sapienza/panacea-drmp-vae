import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardHeader, CardContent, Avatar, Typography } from '@material-ui/core'

import schema from '../../schema'
import { icons } from '../../encodings'
import { SelectedReachableServices, ReachableServices, Vulnerabilities, AttackPaths } from './PersonTables'

const PersonTip = (props) => {
  const { id, context, selectedId, queryResults } = props
  const person = useSelector(state => schema.selectors.persons(state, id))
  const personType = useSelector(state => schema.selectors.personsType(state, id)).type
  const personLocation = useSelector(state => schema.selectors.personsLocation(state, id)).location
  const selected = id === selectedId
  return (
    <Card variant='outlined'>
      <CardHeader
        avatar={
          <Avatar variant='square' src={icons.humansTypes.img[personType]} />
        }
        title={person.name}
        subheader={personType}
      />
      <CardContent>
        <Typography>
          {personLocation !== undefined ? `${personLocation.building} - ${personLocation.corridor} - ${personLocation.floor} - ${personLocation.room}` : ''}
        </Typography>
        {context === 'AttackGraph' && <Vulnerabilities id={id} size='small' />}
        {context === 'AttackGraph' && <div style={{ width: '50%', margin: 'auto', marginTop: '16px' }}><AttackPaths id={id} queryResults={queryResults} size='small' /></div>}
        {context === 'Topology' && selected &&
          <>
            <SelectedReachableServices id={id} size='small' />
          </>}
        {context === 'Topology' && !selected &&
          <>
            <ReachableServices id={id} selectedId={selectedId} size='small' />
          </>}
      </CardContent>
    </Card>
  )
}

export default PersonTip
