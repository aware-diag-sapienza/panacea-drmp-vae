import React from 'react'
import { Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { BarTop } from '../pages'
import graphs from '../graphs'

const useStyles = makeStyles(theme => ({
  root: {
    flex: '1 1 0',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'stretch'
  },
  main: {
    flex: '1 1 auto',
    padding: theme.spacing(1),
    display: 'flex'
  },
  graphContainer: {
    flex: '1 1 0'
  },
  aside: {
    flex: '0 0 400px'
  },
  panelDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  popper: {
    zIndex: theme.zIndex.tooltip
  }
}))

export default () => {
  const classes = useStyles()
  return (
    <>
      <BarTop>
        <div className={classes.root}>
          <Paper className={classes.main}>
            <graphs.C.Human />
          </Paper>
          <Paper className={classes.aside}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}><Typography>Options</Typography></ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                Options
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
        </div>
      </BarTop>
    </>
  )
}
