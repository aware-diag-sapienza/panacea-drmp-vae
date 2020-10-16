import React, { useState } from 'react'
import { Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Popper } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { green, red } from '@material-ui/core/colors'

import { BarTop } from '../pages'
import { Slider, CheckboxesGroup } from '../components'
import graphs from '../graphs'
import AttackGraphTip from '../graphs/tooltips/AttackGraphTip'

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
  const [hideSubnets, setHideSubnets] = useState([2, 3])
  const [currentElement, setCurrentElement] = useState({ model: null, id: null, anchor: null })
  //
  const [visibleLayers, setVisibleLayers] = useState({ network: true, human: true })
  const setVisibleLayer = (name, value) => setVisibleLayers({ ...visibleLayers, [name]: value })
  const visibleLayersEntries = [
    { name: 'network', label: 'Network Layer', value: visibleLayers.network },
    { name: 'human', label: 'Human Layer', value: visibleLayers.human }
  ]
  //
  const [graphEncodings, setGraphEncodings] = useState({ networkEdges: true, attackEdges: false, nodesVulnerabilities: true })
  const setGraphEncoding = (name, value) => setGraphEncodings({ ...graphEncodings, [name]: value })
  const graphEncodingsEntries = [
    { name: 'networkEdges', label: 'Topology edges', value: graphEncodings.networkEdges },
    { name: 'attackEdges', label: 'Attack Graph edges', value: graphEncodings.attackEdges },
    { name: 'nodesVulnerabilities', label: 'Nodes vulnerabilities', value: graphEncodings.nodesVulnerabilities }
  ]
  //
  const [selectedElement, setSelectedElement] = useState({ model: null, id: null, anchor: null })
  const toggleSelectedElement = ({ model, id, anchor }) => {
    if (model === null || id === null || anchor === null || id === selectedElement.id) setSelectedElement({ model: null, id: null, anchor: null })
    else setSelectedElement({ model: model, id: id, anchor: anchor })
  }
  //
  // const [queryInputType, setQueryInputType] = useState(null)
  const [querySources, setQuerySources] = useState([])
  const [queryTargets, setQueryTargets] = useState([])
  const [queryResults] = useState(null)
  const addQueryElement = (side, nodeData) => {
    if (side === 'source' && querySources.map(s => s.id).indexOf(nodeData.id) < 0) {
      setQuerySources(querySources => ([
        ...querySources,
        { model: nodeData.model, id: nodeData.id, name: nodeData.name, type: nodeData.type, privilege: nodeData.model === 'Device' ? 'ROOT' : 'OWN' }
      ]))
    } else if (side === 'target' && queryTargets.map(t => t.id).indexOf(nodeData.id) < 0) {
      setQueryTargets(queryTargets => ([
        ...queryTargets,
        { model: nodeData.model, id: nodeData.id, name: nodeData.name, type: nodeData.type, privilege: nodeData.model === 'Device' ? 'ROOT' : 'OWN' }
      ]))
    }
  }
  //
  return (
    <>
      <BarTop>
        <div className={classes.root}>
          <Paper className={classes.main}>
            <graphs.C.AttackGraph
              className={classes.graphContainer}
              selectedElement={selectedElement}
              toggleSelectedElement={toggleSelectedElement}
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
              visibleLayers={visibleLayers}
              hideSubnets={hideSubnets}
              graphEncodings={graphEncodings}
              nodesCxtCommands={[
                { content: 'Add Source', select: function (e) { addQueryElement('source', e.data()) }, fillColor: green[800] },
                { content: 'Add Target', select: function (e) { addQueryElement('target', e.data()) }, fillColor: red[800] }
              ]}
              currentQuery={null}
              querySources={[]}
              queryTargets={[]}
              queryResults={queryResults}
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
                <CheckboxesGroup
                  title='Graph Encoding'
                  handleChange={setGraphEncoding}
                  entries={graphEncodingsEntries}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
        </div>
        <Popper className={classes.popper} open={currentElement.anchor !== null} anchorEl={currentElement.anchor}>
          <AttackGraphTip
            model={currentElement.model}
            id={currentElement.id}
            selectedModel={selectedElement.model}
            selectedId={selectedElement.id}
            queryResults={queryResults}
          />
        </Popper>
      </BarTop>
    </>
  )
}
