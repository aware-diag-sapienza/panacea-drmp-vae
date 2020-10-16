import React, { useState } from 'react'
import { Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Popper } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { BarTop } from '../pages'
import { Slider, CheckboxesGroup } from '../components'
import graphs from '../graphs'
import TopologyTip from '../graphs/tooltips/TopologyTip'

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
  // State
  const [visibleLayers, setVisibleLayers] = useState({ network: true, human: false })
  const [hideSubnets, setHideSubnets] = useState([2, 3])
  const [selectedElement, setSelectedElement] = useState({ model: null, id: null, anchor: null })
  const [currentElement, setCurrentElement] = useState({ model: null, id: null, anchor: null })
  //
  const setVisibleLayer = (name, value) => setVisibleLayers({ ...visibleLayers, [name]: value })
  const visibleLayersEntries = [
    {
      name: 'network',
      label: 'Network Layer',
      value: visibleLayers.network
    },
    {
      name: 'human',
      label: 'Human Layer',
      value: visibleLayers.human
    }
  ]
  //
  const toggleSelectedElement = ({ model, id, anchor }) => {
    if (model === null || id === null || anchor === null || id === selectedElement.id) setSelectedElement({ model: null, id: null, anchor: null })
    else setSelectedElement({ model: model, id: id, anchor: anchor })
  }
  return (
    <>
      <BarTop>
        <div className={classes.root}>
          <Paper className={classes.main}>
            <graphs.C.Topology
              className={classes.graphContainer}
              selectedElement={selectedElement}
              toggleSelectedElement={toggleSelectedElement}
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
              visibleLayers={visibleLayers}
              hideSubnets={hideSubnets}
              graphEncodings={{ networkEdges: true, attackEdges: false, nodesVulnerabilities: false }}
            />
          </Paper>
          <Paper className={classes.aside}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}><Typography>Options</Typography></ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                <CheckboxesGroup
                  title='Visible Layers'
                  handleChange={setVisibleLayer}
                  entries={visibleLayersEntries}
                />
                <Slider
                  title='Hide Networks'
                  value={[...hideSubnets]}
                  min={0}
                  max={10}
                  handleChange={setHideSubnets}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
        </div>
        <Popper className={classes.popper} open={currentElement.anchor !== null} anchorEl={currentElement.anchor}>
          <TopologyTip
            model={currentElement.model}
            id={currentElement.id}
            selectedModel={selectedElement.model}
            selectedId={selectedElement.id}
          />
        </Popper>
      </BarTop>
    </>
  )
}
