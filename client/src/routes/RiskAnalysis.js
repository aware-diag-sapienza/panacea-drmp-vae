import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Popper, TextField, InputAdornment } from '@material-ui/core'
import { ExpandMore, Delete } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { green, red } from '@material-ui/core/colors'

import { BarTop } from '../pages'
import { Slider, CheckboxesGroup, ListWithRadioIcons } from '../components'
import graphs from '../graphs'
import DependencyGraphTip from '../graphs/tooltips/DependencyGraphTip'
import AttackGraphTip from '../graphs/tooltips/AttackGraphTip'
import { queries, snapshots } from '../modules'
import { useMountEffect } from '../utils'
import schema from '../schema'
import { icons } from '../encodings'

const DEVICE_PRIVILEGES = [
  { value: null, icon: '*' },
  { value: 'NONE', icon: 'N' },
  { value: 'USER', icon: 'U' },
  { value: 'ROOT', icon: 'R' }
]
const PERSON_PRIVILEGES = [
  { value: null, icon: '*' },
  { value: 'OWN', icon: 'O' },
  { value: 'USE', icon: 'U' },
  { value: 'EXECUTE', icon: 'E' }
]

const useStyles = makeStyles(theme => ({
  root: {
    flex: '1 1 0',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  main: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  graphContainer: {
    flex: '1 1 0'
  },
  aside: {
    flex: '0 0 400px'
  },
  panelDetails: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '780px'
  },
  panelOptions: {
    display: 'flex',
    flexDirection: 'column'
  },
  popper: {
    zIndex: theme.zIndex.tooltip
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
  })
  // Highlighted elements
  const [currentElement, setCurrentElement] = useState({ model: null, id: null, anchor: null })
  const [selectedElement, setSelectedElement] = useState({ model: null, id: null, anchor: null })
  const toggleSelectedElement = ({ model, id, anchor }) => {
    if (model === null || id === null || anchor === null || id === selectedElement.id) setSelectedElement({ model: null, id: null, anchor: null })
    else setSelectedElement({ model: model, id: id, anchor: anchor })
  }
  // Attack Graph encoding
  const [hideSubnets, setHideSubnets] = useState([2, 3])
  const [visibleLayers, setVisibleLayers] = useState({ network: true, human: true })
  const setVisibleLayer = (name, value) => setVisibleLayers({ ...visibleLayers, [name]: value })
  const visibleLayersEntries = [
    { name: 'network', label: 'Network Layer', value: visibleLayers.network },
    { name: 'human', label: 'Human Layer', value: visibleLayers.human }
  ]
  const [graphEncodings, setGraphEncodings] = useState({ networkEdges: false, attackEdges: true, nodesVulnerabilities: false })
  const setGraphEncoding = (name, value) => setGraphEncodings({ ...graphEncodings, [name]: value })
  const graphEncodingsEntries = [
    { name: 'networkEdges', label: 'Topology edges', value: graphEncodings.networkEdges },
    { name: 'attackEdges', label: 'Attack Graph edges', value: graphEncodings.attackEdges },
    { name: 'nodesVulnerabilities', label: 'Nodes vulnerabilities', value: graphEncodings.nodesVulnerabilities }
  ]
  // New query
  const [queryName, setQueryName] = useState('')
  const [querySources, setQuerySources] = useState([])
  const [queryTargets, setQueryTargets] = useState([])
  const [queryAgTargets, setQueryAgTargets] = useState({})
  const resetQueryState = () => {
    setQueryName('')
    setQuerySources([])
    setQueryTargets([])
    setQueryAgTargets({})
  }
  const addQueryElement = (side, nodeData) => {
    if (side === 'source' && querySources.map(s => s.id).indexOf(nodeData.id) < 0) {
      setQuerySources(querySources => ([
        ...querySources,
        {
          id: nodeData.id,
          model: nodeData.model,
          value: nodeData.id,
          avatar: icons[nodeData.model === 'Device' ? 'devicesTypes' : 'humansTypes'].img[nodeData.type],
          text: nodeData.label,
          secondary: () =>
            <TextField
              id={`${nodeData.id}-probability`}
              component='span'
              defaultValue={0.5}
              InputProps={{
                startAdornment: <InputAdornment position='start'>Probability: </InputAdornment>
              }}
              onChange={event => editQuerySourcesProbability(nodeData.id, parseFloat(event.target.value))}
            />,
          radioIcons: [
            ...(nodeData.model === 'Device' ? DEVICE_PRIVILEGES.map(p => ({ ...p, handleClick: () => editQuerySourcesPrivilege(nodeData.id, p.value) })) : []),
            ...(nodeData.model === 'Person' ? PERSON_PRIVILEGES.map(p => ({ ...p, handleClick: () => editQuerySourcesPrivilege(nodeData.id, p.value) })) : [])
          ],
          selectedRadio: null,
          probability: 1,
          action: <Delete />,
          handleActionClick: () => removeQueryElement('source', nodeData.id)
        }
      ]))
    } else if (side === 'target' && queryTargets.map(t => t.id).indexOf(nodeData.id) < 0) {
      setQueryTargets(queryTargets => ([
        ...queryTargets,
        {
          id: nodeData.id,
          name: nodeData.businessEntityName,
          avatar: icons.businessEntitiesTypes.img[nodeData.businessEntityType],
          CIA: () => <><span>{`C: ${nodeData.confidentialityLevel}`}</span><span>{`I: ${nodeData.integrityLevel}`}</span><span>{`A: ${nodeData.availabilityLevel}`}</span></>,
          impact: nodeData.impact,
          defaultImpact: nodeData.impact,
          handleDelete: () => removeQueryElement('target', nodeData.id),
          handleChange: event => editQueryTargetsImpact(nodeData.id, parseFloat(event.target.value))
        }
      ]))
    }
  }
  const removeQueryElement = (side, nodeId) => {
    if (side === 'source') {
      setQuerySources(querySources => querySources.filter(n => n.id !== nodeId))
    } else if (side === 'target') {
      setQueryTargets(queryTargets => queryTargets.filter(n => n.id !== nodeId))
      setQueryAgTargets(queryAgTargets => { const { [nodeId]: omit, ...res } = queryAgTargets; return res })
    }
  }
  const editQueryName = (name) => setQueryName(_queryName => name)
  const editQueryTargetsImpact = (nodeId, impact) => {
    setQueryTargets(queryTargets => queryTargets.map(t => {
      if (t.id !== nodeId) return t
      else {
        return {
          ...t,
          impact: impact
        }
      }
    }))
  }
  const editQuerySourcesPrivilege = (nodeId, privilege) => {
    setQuerySources(querySources => querySources.map(s => {
      if (s.id !== nodeId) return s
      else {
        return {
          ...s,
          selectedRadio: privilege
        }
      }
    }))
  }
  const editQuerySourcesProbability = (nodeId, probability) => {
    setQuerySources(querySources => querySources.map(s => {
      if (s.id !== nodeId) return s
      else {
        return {
          ...s,
          probability: probability
        }
      }
    }))
  }
  const updateQueryAgTargets = (nodeId, targets) => {
    setQueryAgTargets(queryAgTargets => ({
      ...queryAgTargets,
      [nodeId]: targets
    }))
  }
  const runQuery = () => {
    const query = {
      type: 'business',
      name: queryName,
      sources: querySources.map(s => ({
        sourceId: s.selectedRadio !== null ? `${s.selectedRadio}@${s.id}` : s.id,
        sourceType: s.model === 'Device' ? 'network' : 'human',
        sourceProbability: s.probability
      })),
      targets: queryTargets.map(t => ({
        targetId: t.id,
        impact: t.impact
      }))
    }
    dispatch(queries.thunks.postQuery(currentSnapshot, query))
  }
  return (
    <>
      <BarTop height='100%'>
        <div className={classes.root}>
          <Paper className={classes.main}>
            <queries.C.ControlBar
              queries={availableQueries}
              currentQuery={currentQuery}
              queryName={queryName}
              handleQueryName={event => editQueryName(event.target.value)}
              runQuery={() => runQuery()}
              clearQuery={() => resetQueryState()}
              deleteQuery={() => resetQueryState()}
              newQuery={() => dispatch(queries.actions.updateSelected(null))}
              selectQuery={id => dispatch(queries.thunks.select(currentSnapshot, id))}
            />
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}><Typography>Dependency Graph</Typography></ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                <>
                  <graphs.C.DependencyGraph
                    selectedElement={selectedElement}
                    toggleSelectedElement={toggleSelectedElement}
                    currentElement={currentElement}
                    setCurrentElement={setCurrentElement}
                    nodesCxtCommands={
                      currentQuery === null
                        ? [{ content: 'Add Target', select: function (e) { addQueryElement('target', e.data()); updateQueryAgTargets(e.data('id'), e.successors('node.ServiceLevel').map(n => n.data('id'))) }, fillColor: red[800] }]
                        : []
                    }
                    currentQuery={currentQuery}
                    queryTargets={queryTargets}
                    queryResults={currentQueryResults}
                  />
                  <div className={classes.aside}>
                    {currentQuery === null
                      ? <queries.C.Targets targets={queryTargets} />
                      : <queries.C.Risks queryResults={currentQueryResults} />}
                  </div>
                </>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}><Typography>Attack Graph</Typography></ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                <>
                  <graphs.C.AttackGraph
                    className={classes.graphContainer}
                    selectedElement={selectedElement}
                    toggleSelectedElement={toggleSelectedElement}
                    currentElement={currentElement}
                    setCurrentElement={setCurrentElement}
                    visibleLayers={visibleLayers}
                    hideSubnets={hideSubnets}
                    graphEncodings={graphEncodings}
                    nodesCxtCommands={
                      currentQuery === null
                        ? [{ content: 'Add Source', select: function (e) { addQueryElement('source', e.data()) }, fillColor: green[800] }]
                        : []
                    }
                    currentQuery={currentQuery}
                    querySources={querySources}
                    queryTargets={[...new Set(Object.values(queryAgTargets).flat(1))]}
                    queryResults={currentQueryResults}
                  />
                  <div className={classes.aside}>
                    <ExpansionPanel elevation={0}>
                      <ExpansionPanelSummary expandIcon={<ExpandMore />}><Typography>Options</Typography></ExpansionPanelSummary>
                      <ExpansionPanelDetails className={classes.panelOptions}>
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
                    {currentQuery === null
                      ? <ListWithRadioIcons title='Sources' entries={querySources} radioIcons />
                      : null}
                  </div>
                </>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
        </div>
      </BarTop>
      <Popper className={classes.popper} open={currentElement.anchor !== null && currentElement.model === 'ServiceLevel'} anchorEl={currentElement.anchor}>
        <DependencyGraphTip
          model={currentElement.model}
          id={currentElement.id}
          selectedModel={selectedElement.model}
          selectedId={selectedElement.id}
        />
      </Popper>
      <Popper className={classes.popper} open={currentElement.anchor !== null && currentElement.model !== 'ServiceLevel'} anchorEl={currentElement.anchor}>
        <AttackGraphTip
          model={currentElement.model}
          id={currentElement.id}
          selectedModel={selectedElement.model}
          selectedId={selectedElement.id}
          queryResults={currentQueryResults.attackGraph}
        />
      </Popper>
    </>
  )
}
