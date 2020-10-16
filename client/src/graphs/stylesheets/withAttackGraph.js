import React from 'react'
import { blue, green, red, yellow, teal } from '@material-ui/core/colors'
import { scaleSequential } from 'd3-scale'
import { schemeRdYlGn } from 'd3-scale-chromatic'

const withAttackGraph = (Component) => {
  const WithAttackGraph = (props) => {
    let { stylesheet, ...other } = props
    const queryEdgeWidth = scaleSequential().range([3, 12])
    const queryNodeSize = scaleSequential().range([30, 60])
    if (props.currentQuery) {
      queryEdgeWidth.domain([1, Math.max(...Object.values(props.queryResults.attackGraph.edges).map(e => e.numPaths))])
      queryNodeSize.domain([1, Math.max(...Object.values(props.queryResults.attackGraph.nodes).map(n => n.numPaths))])
    }
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'edge.Topology',
        style: {
          opacity: 0.6
        }
      },
      {
        selector: 'edge.AttackGraph',
        style: {
          'line-fill': 'linear-gradient',
          'line-gradient-stop-colors': [...schemeRdYlGn[10]].reverse(),
          opacity: 0.5,
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': [...schemeRdYlGn[10]].reverse()[9]
        }
      },
      {
        selector: 'edge.AttackGraph.InterElement',
        style: {
          'line-fill': 'solid',
          'line-color': blue[200],
          'target-arrow-color': blue[200]
        }
      }
    ])
    if (props.currentQuery === null) {
      // New Query
      if (['Device', 'DevicePrivilege', 'Person', 'PersonPrivilege'].indexOf(props.selectedElement.model) > -1) {
        // Selected element
        stylesheet = stylesheet.concat([
          {
            selector: '[?selected]',
            style: {
              'background-color': blue[500]
            }
          },
          {
            selector: 'edge.Topology',
            style: {
              opacity: 0.2
            }
          },
          {
            selector: 'edge.AttackGraph',
            style: {
              opacity: 0.3
            }
          },
          {
            selector: '[?selectedIncoming][!selectedOutgoing]',
            style: {
              'line-fill': 'solid',
              'line-color': green[500],
              'target-arrow-color': green[500],
              width: 4,
              opacity: 0.8
            }
          },
          {
            selector: '[!selectedIncoming][?selectedOutgoing]',
            style: {
              'line-fill': 'solid',
              'line-color': red[700],
              'target-arrow-color': red[700],
              width: 4,
              opacity: 0.8
            }
          },
          {
            selector: '[?selectedIncoming][?selectedOutgoing]',
            style: {
              'line-fill': 'solid',
              'line-color': yellow[500],
              'target-arrow-color': yellow[500],
              width: 4,
              opacity: 0.8
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
            selector: '[!selected][?selectedSource][?selectedTarget]',
            style: {
              'background-color': yellow[500]
            }
          }
        ])
        if (['Device', 'DevicePrivilege'].indexOf(props.selectedElement.model) > -1) {
          stylesheet = stylesheet.concat([
            {
              selector: '.InterElement[?selectedIncoming][!selectedOutgoing]',
              style: {
                'line-color': blue[200],
                'target-arrow-color': blue[200]
              }
            },
            {
              selector: '.HumanElement[?selectedSource][!selectedTarget]',
              style: {
                'background-color': blue[200]
              }
            }
          ])
        } else if (['Person', 'PersonPrivilege'].indexOf(props.selectedElement.model) > -1) {
          stylesheet = stylesheet.concat([
            {
              selector: '.InterElement[!selectedIncoming][?selectedOutgoing]',
              style: {
                'line-color': blue[200],
                'target-arrow-color': blue[200]
              }
            },
            {
              selector: '.NetworkElement[!selectedSource][?selectedTarget]',
              style: {
                'background-color': blue[200]
              }
            }
          ])
        }
      }
      stylesheet = stylesheet.concat([
        {
          selector: '[?querySource]',
          style: {
            'background-color': teal[900]
          }
        },
        {
          selector: '[?queryTarget]',
          style: {
            'background-color': red[900]
          }
        }
      ])
    } else {
      // Query Analysis
      stylesheet = stylesheet.concat([
        {
          selector: '.Device[?queryNode]',
          style: { 'pie-size': '100%' }
        },
        {
          selector: '.Person[?queryNode]',
          style: { 'pie-size': '141%' }
        },
        {
          selector: '[?queryNode]',
          style: {
            width: n => queryNodeSize(n.data('queryPaths')),
            height: n => queryNodeSize(n.data('queryPaths')),
            'pie-1-background-color': green[800],
            'pie-1-background-size': e => e.data('querySource') / e.data('queryPaths') * 100,
            'pie-2-background-color': blue[800],
            'pie-2-background-size': e => e.data('queryMiddle') / e.data('queryPaths') * 100,
            'pie-3-background-color': red[800],
            'pie-3-background-size': e => e.data('queryTarget') / e.data('queryPaths') * 100
          }
        },
        {
          selector: '[?queryEdge]',
          style: {
            width: e => queryEdgeWidth(e.data('queryPaths')),
            'line-fill': 'solid',
            'line-color': red[800],
            'target-arrow-color': red[800],
            opacity: 0.8
          }
        }
      ])
    }
    if (!props.graphEncodings.attackEdges) {
      stylesheet.push({
        selector: 'edge.AttackGraph[!selectedIncoming][!selectedOutgoing][!queryEdge]',
        style: {
          display: 'none'
        }
      })
    }
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithAttackGraph
}

export default withAttackGraph
