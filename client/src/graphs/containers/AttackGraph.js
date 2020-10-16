import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { withSize } from 'react-sizeme'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import cola from 'cytoscape-cola'

import { useMountEffect } from '../../utils'
import { getAttackGraph, getAttackGraphMappingFromDependencyGraph } from '../selectors'
import { withTopology, withNetworkTopology, withHumanTopology, withInterTopology, withNetworkAttackGraph, withHumanAttackGraph, withInterAttackGraph, withAttackGraph } from '../stylesheets'

cytoscape.use(cola)

/*
const saveLayout = (graph) => {
  if (graph !== null) {
    const nodes = {}
    const xMin = Math.min(...graph.current.nodes().map(n => n.position().x))
    const xMax = Math.max(...graph.current.nodes().map(n => n.position().x))
    const yMin = Math.min(...graph.current.nodes().map(n => n.position().y))
    const yMax = Math.max(...graph.current.nodes().map(n => n.position().y))
    graph.current.nodes().forEach(el => {
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

const useStyles = makeStyles(theme => ({
  root: {},
  graph: {}
}))

const AttackGraph = (props) => {
  const { size, className, stylesheet, visibleLayers, hideSubnets, selectedElement, toggleSelectedElement, setCurrentElement, nodesCxtCommands, currentQuery, querySources, queryTargets, queryResults } = props
  const classes = useStyles()
  // Graph Elements
  const graph = useRef(null)
  const [expandedDevices] = useState([])
  const [expandedPersons] = useState([])
  const { nodes, edges } = useSelector(state => getAttackGraph(state, visibleLayers.network, visibleLayers.human, hideSubnets, expandedDevices, expandedPersons))
  const targetNodes = useSelector(state => getAttackGraphMappingFromDependencyGraph(state, queryTargets, expandedDevices))
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
    graph.current.cxtmenu({
      selector: '.Device, .Person',
      openMenuEvents: 'taphold',
      commands: nodesCxtCommands
    })
    // graph.current.on('mouseup', 'node', _ => saveLayout(graph))
  })
  useEffect(() => {
    graph.current.resize()
    graph.current.fit()
  }, [size.width, size.height, visibleLayers.network, visibleLayers.human])
  // Handle selected element
  useEffect(() => {
    graph.current.nodes().data({ selected: false, selectedSource: false, selectedTarget: false })
    graph.current.edges().data({ selectedIncoming: false, selectedOutgoing: false })
    if (selectedElement.id !== null) {
      graph.current.getElementById(selectedElement.id).data('selected', true)
      graph.current.getElementById(selectedElement.id).outgoers('node.Device, node.Person, node.AttackGraph').data('selectedTarget', true)
      graph.current.getElementById(selectedElement.id).incomers('node').data('selectedSource', true)
      graph.current.getElementById(selectedElement.id).outgoers('edge.AttackGraph').data('selectedOutgoing', true)
      graph.current.getElementById(selectedElement.id).incomers('edge.AttackGraph').data('selectedIncoming', true)
    }
  }, [selectedElement.id])
  // Handle query
  useEffect(() => {
    if (currentQuery === null) {
      graph.current.nodes().data({ querySource: false })
      querySources.forEach(s => {
        graph.current.getElementById(s.id).data('querySource', true)
      })
    }
  }, [currentQuery, querySources, visibleLayers])
  useEffect(() => {
    if (currentQuery === null) {
      graph.current.nodes().data({ queryTarget: false })
      targetNodes.forEach(tId => {
        graph.current.getElementById(tId).data('queryTarget', true)
      })
    }
  }, [currentQuery, targetNodes, visibleLayers])
  useEffect(() => {
    graph.current.nodes().data({ queryNode: false, queryPaths: false, querySource: false, queryMiddle: false, queryTarget: false })
    graph.current.edges().data({ queryEdge: false, queryPaths: false })
    if (currentQuery !== null) {
      Object.values(queryResults.attackGraph.nodes).forEach(node => {
        graph.current.getElementById(node.id).data({
          queryNode: true,
          queryPaths: node.numPaths,
          querySource: node.numSource,
          queryMiddle: node.numMiddle,
          queryTarget: node.numTarget
        })
      })
      Object.values(queryResults.attackGraph.edges).forEach(edge => {
        graph.current.getElementById(edge.id).data({
          queryEdge: true,
          queryPaths: edge.numPaths
        })
      })
    }
  }, [currentQuery, queryResults, visibleLayers])
  // Render
  return (
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
  )
}

export default withSize({ monitorHeight: true })(
  withNetworkTopology(
    withHumanTopology(
      withInterTopology(
        withTopology(
          withNetworkAttackGraph(
            withHumanAttackGraph(
              withInterAttackGraph(
                withAttackGraph(
                  AttackGraph
                )
              )
            )
          )
        )
      )
    )
  )
)
