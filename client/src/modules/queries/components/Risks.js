import React from 'react'
import { Card, CardHeader, CardContent, Avatar, Typography, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { scaleSequential } from 'd3-scale'
import { interpolateRdYlGn } from 'd3-scale-chromatic'

import { icons } from '../../../encodings'

const riskScale = scaleSequential(interpolateRdYlGn)
  .domain([3, 0])

const useStyles = makeStyles(theme => ({
  subheader: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  risksBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  serviceLevelCard: {
    margin: theme.spacing(1)
  },
  riskValue: {
    color: 'white'
  }
}))

const Cia = ({ nodeData }) =>
  <>
    <span>{`C: ${nodeData.confidentiality}`}</span>
    <span>{`I: ${nodeData.integrity}`}</span>
    <span>{`A: ${nodeData.availability}`}</span>
  </>

const Risk = ({ risk }) => {
  const ATTACKERS = ['NAIVE', 'ADVANCED', 'PROFESSIONAL']
  const classes = useStyles()
  return (
    <div className={classes.risksBox}>
      {ATTACKERS.map(a =>
        <Box
          key={a}
          width={60}
          border={1}
          borderColor='grey.300'
          flexGrow={0}
          bgcolor={riskScale(risk[a].toFixed(2))}
        >
          <Typography align='center' variant='overline' display='block' color='textSecondary'>{a.substring(0, 3)}</Typography>
          <Typography align='center' variant='h5' className={classes.riskValue}>{risk[a].toFixed(2)}</Typography>
        </Box>
      )}
    </div>
  )
}
const Risks = (props) => {
  const { queryResults, ...other } = props
  const classes = useStyles()
  return (
    <>
      <div {...other}>
        {queryResults.riskProfile.serviceLevels.map(sl =>
          <Card key={sl.id} className={classes.serviceLevelCard} elevation={5}>
            <CardHeader
              classes={{ subheader: classes.subheader }}
              avatar={
                <Avatar variant='square' src={icons.businessEntitiesTypes.img[sl.businessEntityType]} />
              }
              action={<Typography variant='overline'>{`Impact: ${sl.impact}`}</Typography>}
              title={sl.businessEntityName}
              subheader={<Cia nodeData={sl} />}
            />
            <CardContent classes={{ root: classes.content }}>
              <Typography variant='h6' align='center'>RISKS</Typography>
              <Risk risk={sl.risk} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

export default Risks
