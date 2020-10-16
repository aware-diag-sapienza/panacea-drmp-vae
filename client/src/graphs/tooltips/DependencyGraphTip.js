import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardHeader, CardContent, Avatar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import schema from '../../schema'
import { icons } from '../../encodings'

const useStyles = makeStyles(theme => ({
  subheader: {
    display: 'flex',
    flexDirection: 'column'
  }
}))

const Cia = ({ nodeData }) =>
  <>
    <span>{`C: ${nodeData.confidentialityLevel}`}</span>
    <span>{`I: ${nodeData.integrityLevel}`}</span>
    <span>{`A: ${nodeData.availabilityLevel}`}</span>
  </>

const DependencyGraphTip = (props) => {
  const { id } = props
  const classes = useStyles()
  const serviceLevel = useSelector(state => schema.selectors.serviceLevels(state, id))
  const businessEntity = useSelector(state => schema.selectors.businessEntities(state, serviceLevel.businessEntity))
  return (
    <Card variant='outlined'>
      <CardHeader
        classes={{ subheader: classes.subheader }}
        avatar={
          <Avatar variant='square' src={icons.businessEntitiesTypes.img[businessEntity.businessEntityType]} />
        }
        title={businessEntity.name}
        subheader={<Cia nodeData={serviceLevel} />}
      />
      <CardContent classes={{ root: classes.content }}>
        <Typography align='center'>{`Impact: ${serviceLevel.impact}`}</Typography>
      </CardContent>
    </Card>
  )
}

export default DependencyGraphTip
