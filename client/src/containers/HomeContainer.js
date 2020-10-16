import React from 'react'
import { useSelector } from 'react-redux'
import { Container, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { snapshots, queries } from '../modules'
import QueryCompact from './QueryCompact'

const useStyles = makeStyles(theme => ({
  rootPre: {
    marginTop: theme.spacing(2),
    width: theme.breakpoints.values.sm
  },
  rootDefault: {
    flex: '1 1 0',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  main: {
    flex: '1 1 0',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  snapshotContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  snapshot: {
    marginLeft: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: 800,
    margin: 'auto'
  }
}))

const HomeContainer = () => {
  const classes = useStyles()
  const snapshotSelected = useSelector(state => snapshots.selectors.getSelected(state))
  const availableQueries = useSelector(state => queries.selectors.getEntries(state))
  /*
  const info = useSelector(state => schema.selectors.info(state)).map(i => ({ ...i, key: i.entities }))
  const columns = [
    { title: 'Entities', field: 'entities' },
    { title: 'Number', field: 'number' }
  ]
  */
  return (
    <>
      {snapshotSelected === null ? (
        <Container className={classes.rootPre}><Paper><snapshots.C.Picker /></Paper></Container>
      ) : (
        <div className={classes.rootDefault}>
          <div className={classes.main}>
            <div className={classes.snapshotContainer}>
              <Typography variant='h4' className={classes.snapshot} color='textSecondary'>{snapshotSelected.timestamp}</Typography>
              <snapshots.C.Picker />
            </div>
            {availableQueries.length > 0 && <QueryCompact />}
          </div>
        </div>

      )}
    </>
  )
}

export default HomeContainer
