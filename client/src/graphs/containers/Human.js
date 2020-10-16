import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { withSize } from 'react-sizeme'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import dagre from 'cytoscape-dagre'

import { getHuman } from '../selectors'
import { withHuman } from '../stylesheets'

cytoscape.use(dagre)

const useStyles = makeStyles(theme => ({
  root: {},
  graph: {}
}))

const Human = (props) => {
  const { size, className, stylesheet } = props
  const classes = useStyles()
  // Graph Elements
  const graph = useRef(null)
  const { nodes, edges } = useSelector(state => getHuman(state))
  // Init
  useEffect(() => {
    graph.current.fit()
    graph.current.autounselectify(true)
  }, [])
  useEffect(() => {
    graph.current.resize()
    graph.current.fit()
  }, [size.width, size.height])
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
  withHuman(
    Human
  )
)
