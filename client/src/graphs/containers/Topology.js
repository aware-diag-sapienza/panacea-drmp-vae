import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { withSize } from 'react-sizeme'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import cola from 'cytoscape-cola'

import schema from '../../schema'
import { useMountEffect, onlyUnique } from '../../utils'

import { getTopology } from '../selectors'
import { withTopology, withNetworkTopology, withHumanTopology } from '../stylesheets'
import withInterTopology from '../stylesheets/withInterTopology'

cytoscape.use(cola)

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex'
  },
  graph: {
    flex: 1
  }
}))

/*
const saveLayout = (graph) => {
  if (graph !== null) {
    const nodes = {}
    const xMin = Math.min(...graph.nodes().map(n => n.position().x))
    const xMax = Math.max(...graph.nodes().map(n => n.position().x))
    const yMin = Math.min(...graph.nodes().map(n => n.position().y))
    const yMax = Math.max(...graph.nodes().map(n => n.position().y))
    graph.nodes().forEach(el => {
      nodes[el.data().id] = {
        id: el.data().id,
        x: 1500 * el.position().x / (xMax - xMin),
        y: 1000 * el.position().y / (yMax - yMin)
      }
    })
    console.log(nodes)
  }
}
*/

const Topology = (props) => {
  const { size, className, stylesheet, visibleLayers, hideSubnets, selectedElement, toggleSelectedElement, setCurrentElement } = props
  const classes = useStyles()
  // Graph Elements
  const graph = useRef(null)
  const { nodes, edges } = useSelector(state => getTopology(state, visibleLayers.network, visibleLayers.human, hideSubnets, true))
  const deviceSourceDevices = useSelector(state => schema.selectors.deviceNetSourceDevices(state, selectedElement.id)).map(s => s.deviceSource.id).filter(onlyUnique)
  const deviceTargetDevices = useSelector(state => schema.selectors.deviceNetTargetDevices(state, selectedElement.id)).map(t => t.deviceTarget.id).filter(onlyUnique)
  const deviceSourcePersons = useSelector(state => schema.selectors.deviceNetSourcePersons(state, selectedElement.id)).map(s => s.personSource.id).filter(onlyUnique)
  // const personDevices = useSelector(state => schema.selectors.personDevices(state, selectedElement.id)).map(t => t.deviceTarget.id).filter(onlyUnique)
  const personTargetDevices = useSelector(state => schema.selectors.personNetTargetDevices(state, selectedElement.id)).map(t => t.deviceTarget.id).filter(onlyUnique)
  // Init
  useMountEffect(() => {
    graph.current.fit()
    graph.current.autounselectify(true)
    graph.current.on('mouseover', 'node', ({ target }) => setCurrentElement({ model: target.data('model'), id: target.data('id'), anchor: target.popperRef() }))
    graph.current.on('mouseout', 'node', _ => setCurrentElement({ model: null, id: null, anchor: null }))
    graph.current.on('click', ({ cy, target }) => {
      if (cy === target) toggleSelectedElement({ model: null, id: null, anchor: null })
      else toggleSelectedElement({ model: target.data('model'), id: target.data('id'), anchor: target.popperRef() })
    })
  })
  useEffect(() => {
    graph.current.resize()
    graph.current.fit()
  }, [size.width, size.height, visibleLayers.network, visibleLayers.human])
  // Handle selected element
  useEffect(() => {
    graph.current.elements().removeClass('selected')
    if (selectedElement.id !== null) {
      graph.current.getElementById(selectedElement.id).addClass('selected')
      graph.current.getElementById(selectedElement.id).openNeighborhood('edge').addClass('selected')
    }
  }, [selectedElement.id])
  // Handle sources and targets
  useEffect(() => {
    graph.current.nodes().data({ selectedSource: false, selectedTarget: false })
    deviceSourceDevices.forEach(s => graph.current.$id(s).data('selectedSource', true))
    deviceSourcePersons.forEach(s => graph.current.$id(s).data('selectedSource', true))
    deviceTargetDevices.forEach(t => graph.current.$id(t).data('selectedTarget', true))
    personTargetDevices.forEach(t => graph.current.$id(t).data('selectedTarget', true))
  }, [graph, deviceSourceDevices, deviceSourcePersons, deviceTargetDevices, personTargetDevices])
  // Render
  return (
    <>
      <div className={clsx(className, classes.root)}>
        <CytoscapeComponent
          className={classes.graph}
          elements={CytoscapeComponent.normalizeElements({ nodes, edges })}
          cy={cy => { graph.current = cy }}
          style={{ width: size.width, height: size.height }}
          stylesheet={stylesheet}
          layout={{ name: 'cola' }}
        />
      </div>
    </>
  )
}

export default withSize({ monitorHeight: true })(
  withNetworkTopology(
    withHumanTopology(
      withInterTopology(
        withTopology(
          Topology
        )
      )
    )
  )
)
