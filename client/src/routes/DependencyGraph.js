import React, { useState } from 'react'
import { Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Popper } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { BarTop } from '../pages'
import graphs from '../graphs'
import DependencyGraphTip from '../graphs/tooltips/DependencyGraphTip'

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
  const [currentElement, setCurrentElement] = useState({ model: null, id: null, anchor: null })
  const [selectedElement, setSelectedElement] = useState({ model: null, id: null, anchor: null })
  const toggleSelectedElement = ({ model, id, anchor }) => {
    if (model === null || id === null || anchor === null || id === selectedElement.id) setSelectedElement({ model: null, id: null, anchor: null })
    else setSelectedElement({ model: model, id: id, anchor: anchor })
  }
  return (
    <>
      <BarTop>
        <div className={classes.root}>
          <Paper className={classes.main}>
            <graphs.C.DependencyGraph
              selectedElement={selectedElement}
              toggleSelectedElement={toggleSelectedElement}
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
              nodesCxtCommands={[]}
              currentQuery={null}
              queryTargets={[]}
              queryResults={{}}
            />
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
      <Popper className={classes.popper} open={currentElement.anchor !== null} anchorEl={currentElement.anchor}>
        <DependencyGraphTip
          model={currentElement.model}
          id={currentElement.id}
          selectedModel={selectedElement.model}
          selectedId={selectedElement.id}
        />
      </Popper>
    </>
  )
}
