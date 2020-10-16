import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import graphs from '../graphs'
import { useMountEffect } from '../utils'
import { queries, snapshots } from '../modules'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 2)
  },
  main: {
    display: 'flex',
    flexFlow: 'row nowrap',
    margin: theme.spacing(0, 2)
  },
  queryName: {
    marginTop: theme.spacing(2)
  },
  graphContainer: {
    flex: '1 1 0',
    margin: theme.spacing(3)
  },
  risksContainer: {
    flex: '0 0 300px',
    margin: theme.spacing(3)
  }
}))

export default () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  // Init
  const currentQuery = useSelector(state => queries.selectors.getSelected(state))
  const currentQueryResults = useSelector(state => queries.selectors.handleQueryOutput(state))
  const availableQueries = useSelector(state => queries.selectors.getEntries(state))
  const currentSnapshot = useSelector(state => snapshots.selectors.getSelected(state).id)
  useMountEffect(() => {
    dispatch(queries.thunks.getAll(currentSnapshot))
    dispatch(queries.actions.updateSelected(null))
    dispatch(queries.thunks.select(currentSnapshot, availableQueries[0].id))
  })
  // Highlighted elements
  const currentElement = { model: null, id: null, anchor: null }
  const selectedElement = { model: null, id: null, anchor: null }
  // Attack Graph encoding
  const hideSubnets = [2, 3]
  const visibleLayers = { network: true, human: true }
  const graphEncodings = { networkEdges: true, attackEdges: true, nodesVulnerabilities: true }
  return (

    <Paper className={classes.root}>
      <Typography variant='h5' color='textPrimary' align='center' className={classes.queryName}>{currentQuery ? currentQuery.name : ''}</Typography>
      <div className={classes.main}>
        <div className={classes.risksContainer}>
          <queries.C.Risks queryResults={currentQueryResults} />
        </div>
        <graphs.C.DependencyGraph
          className={classes.graphContainer}
          selectedElement={selectedElement}
          toggleSelectedElement={_ => {}}
          currentElement={currentElement}
          setCurrentElement={_ => {}}
          nodesCxtCommands={[]}
          currentQuery={currentQuery}
          queryTargets={[]}
          queryResults={currentQueryResults}
        />
        <graphs.C.AttackGraph
          className={classes.graphContainer}
          selectedElement={selectedElement}
          toggleSelectedElement={_ => {}}
          currentElement={currentElement}
          setCurrentElement={_ => {}}
          visibleLayers={visibleLayers}
          hideSubnets={hideSubnets}
          graphEncodings={graphEncodings}
          nodesCxtCommands={[]}
          currentQuery={currentQuery}
          querySources={[]}
          queryTargets={[]}
          queryResults={currentQueryResults}
        />
      </div>
    </Paper>
  )
}
