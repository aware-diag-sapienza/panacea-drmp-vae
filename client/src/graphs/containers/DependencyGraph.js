import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { withSize } from 'react-sizeme'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import dagre from 'cytoscape-dagre'

import { useMountEffect } from '../../utils'
import { getDependencyGraph } from '../selectors'
import { withDependencyGraph } from '../stylesheets'

cytoscape.use(dagre)

const useStyles = makeStyles(theme => ({
  root: {},
  graph: {}
}))

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
  }
}
*/

const DependencyGraph = (props) => {
  const { size, className, stylesheet, selectedElement, toggleSelectedElement, setCurrentElement, nodesCxtCommands, currentQuery, queryTargets, queryResults } = props
  const classes = useStyles()
  // Graph Elements
  const graph = useRef(null)
  const { nodes, edges } = useSelector(state => getDependencyGraph(state))
  // Init
  useMountEffect(() => {
    graph.current.fit()
    graph.current.autounselectify(true)
    graph.current.on('mouseover', 'node.ServiceLevel', ({ target }) => setCurrentElement({ model: target.data('model'), id: target.data('id'), anchor: target.popperRef() }))
    graph.current.on('mouseout', 'node.ServiceLevel', _ => setCurrentElement({ model: null, id: null, anchor: null }))
    graph.current.on('click', ({ cy, target }) => {
      if (cy === target) toggleSelectedElement({ model: null, id: null, anchor: null })
      else toggleSelectedElement({ model: target.data('model'), id: target.data('id'), anchor: target.popperRef() })
    })
    graph.current.cxtmenu({
      selector: '.ServiceLevel',
      openMenuEvents: 'taphold',
      commands: nodesCxtCommands
    })
    // graph.current.on('mouseup', 'node', _ => saveLayout(graph))
  })
  useEffect(() => {
    graph.current.resize()
    graph.current.fit()
  }, [size.width, size.height])
  useEffect(() => {
    graph.current.nodes().data({ selected: false, selectedSource: false, selectedTarget: false })
    graph.current.edges().data({ selectedIncoming: false, selectedOutgoing: false })
    if (selectedElement.id !== null) {
      graph.current.getElementById(selectedElement.id).data('selected', true)
      graph.current.getElementById(selectedElement.id).successors('node').data('selectedTarget', true)
      graph.current.getElementById(selectedElement.id).predecessors('node').data('selectedSource', true)
      graph.current.getElementById(selectedElement.id).successors('edge').data('selectedOutgoing', true)
      graph.current.getElementById(selectedElement.id).predecessors('edge').data('selectedIncoming', true)
    }
  }, [selectedElement.id])
  // Handle query
  useEffect(() => {
    graph.current.nodes().data({ queryTarget: false, queryTargetSuccessor: false })
    graph.current.edges().data({ queryTargetEdge: false })
    if (currentQuery === null) {
      queryTargets.forEach(t => {
        graph.current.getElementById(t.id).data('queryTarget', true)
        graph.current.getElementById(t.id).successors('node').data('queryTargetSuccessor', true)
        graph.current.getElementById(t.id).successors('edge').data('queryTargetEdge', true)
      })
    }
  }, [currentQuery, queryTargets])
  useEffect(() => {
    graph.current.nodes().data({ queryTarget: false, queryTargetRisk: false })
    graph.current.edges().data({ queryTargetEdge: false, queryTargetRisk: false })
    const computeRiskMax = (risk1, risk2) => {
      if (!risk2) return risk1
      return risk1.PROFESSIONAL > risk2.PROFESSIONAL ? risk1 : risk2
    }
    if (currentQuery !== null) {
      queryResults.riskProfile.serviceLevels.forEach(serviceLevel => {
        const target = graph.current.getElementById(serviceLevel.id)
        const dijkstra = graph.current.elements().dijkstra(target)
        target.data({ queryTarget: true, queryTargetRisk: serviceLevel.risk })
        serviceLevel.sourceServiceLevels.forEach(sourceSl => {
          const source = graph.current.getElementById(sourceSl)
          const path = dijkstra.pathTo(source)
          path.forEach((step, idx) => {
            if (idx % 2 === 0) {
              if (idx !== 0) step.data({ queryTarget: true, queryTargetRisk: computeRiskMax(serviceLevel.risk, step.data('queryTargetRisk')) })
            } else step.data({ queryTargetEdge: true, queryTargetRisk: computeRiskMax(serviceLevel.risk, step.data('queryTargetRisk')) })
          })
          // source.data({ queryTarget: true, queryTargetRisk: computeRiskMax(serviceLevel.risk, source.data('queryTargetRisk')) })
          // target.edgesTo(source).data({ queryTargetEdge: true, queryTargetRisk: computeRiskMax(serviceLevel.risk, target.edgesTo(source).data('queryTargetRisk')) })
          // target.edgesTo(source).forEach(t => t.target().data({ queryTarget: true, queryTargetRisk: computeRiskMax(serviceLevel.risk, t.target().data('queryTargetRisk')) }))
        })
      })
    }
  }, [currentQuery, queryResults])
  // Render
  return (
    <div className={clsx(className, classes.root)}>
      <CytoscapeComponent
        className={classes.graph}
        elements={CytoscapeComponent.normalizeElements({ nodes, edges })}
        cy={cy => { graph.current = cy }}
        style={{ width: size.width, height: size.height }}
        stylesheet={stylesheet}
        layout={{ name: 'dagre' }}
      />
    </div>
  )
}

export default withSize({ monitorHeight: true })(
  withDependencyGraph(
    DependencyGraph
  )
)
