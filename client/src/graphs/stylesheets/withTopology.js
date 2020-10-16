import React from 'react'
import { blueGrey, blue, green, red, yellow } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/core/styles'

const withTopology = (Component) => {
  const WithTopology = (props) => {
    const theme = useTheme()
    let { stylesheet, ...other } = props
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'node',
        style: {
          'background-color': blueGrey[300],
          label: 'data(label)',
          color: theme.palette.text.primary,
          'border-width': 1,
          'border-color': blueGrey[400]
        }
      },
      {
        selector: 'edge',
        style: {
          'line-color': blueGrey[200],
          opacity: 0.8
        }
      },
      {
        selector: 'node.selected',
        style: {
          'background-color': blue[500]
        }
      },
      {
        selector: 'edge.selected',
        style: {
          'line-color': blue[500]
        }
      },
      {
        selector: '[?selectedSource][!selectedTarget]',
        style: {
          'background-color': green[500]
        }
      },
      {
        selector: '[!selectedSource][?selectedTarget]',
        style: {
          'background-color': red[700]
        }
      },
      {
        selector: '[?selectedSource][?selectedTarget]',
        style: {
          'background-color': yellow[500]
        }
      }
    ])
    if (!props.graphEncodings.networkEdges) {
      stylesheet.push({
        selector: 'edge.Topology',
        style: {
          display: 'none'
        }
      })
    }
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithTopology
}

export default withTopology
