import React from 'react'
import { scaleSequential } from 'd3-scale'
import { interpolateRdYlGn } from 'd3-scale-chromatic'
import { blueGrey, blue, red } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/core/styles'

import { getStyle, icons } from '../../encodings'

const riskScale = scaleSequential(interpolateRdYlGn)
  .domain([3, 0])

const withDependencyGraph = (Component) => {
  const WithDependencyGraph = (props) => {
    const theme = useTheme()
    console.log(theme)
    let { stylesheet, ...other } = props
    const styleProps = { theme }
    const style = getStyle(styleProps)
    const impactScale = scaleSequential()
      .domain([0, 1])
      .range([blueGrey[50], blueGrey[600]])
    const impactSelectedScale = scaleSequential()
      .domain([0, 1])
      .range([blue[50], blue[800]])
    const impactSourceScale = scaleSequential()
      .domain([0, 1])
      .range([blue[50], blue[800]])
    const impactTargetScale = scaleSequential()
      .domain([0, 1])
      .range([red[50], red[800]])
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'node',
        style: style.dependencyGraph.nodeStyle
      },
      {
        selector: 'edge',
        style: {
          ...style.dependencyGraph.edgeStyle,
          opacity: 0.8
        }
      },
      {
        selector: 'node.BusinessEntity',
        style: {
          'background-color': blueGrey[50],
          label: 'data(label)',
          color: theme.palette.text.primary
        }
      },
      {
        selector: 'node.ServiceLevel',
        style: {
          'background-color': el => impactScale(el.data('impact'))
        }
      },
      {
        selector: 'node.ServiceDependency',
        style: {
          'background-color': blueGrey[50]
        }
      },
      {
        selector: 'node.AND',
        style: {
          shape: 'triangle'
        }
      },
      {
        selector: 'node.OR',
        style: {
          shape: 'polygon',
          'shape-polygon-points': [
            -1, -1,
            1, -1,
            0, 1
          ]
        }
      }
    ])
    if (props.currentQuery === null) {
      // New Query
      if (props.selectedElement.model === 'ServiceLevel') {
        // Selected element
        stylesheet = stylesheet.concat([
          {
            selector: '[?selected]',
            style: {
              'background-color': el => impactSelectedScale(el.data('impact'))
            }
          },
          {
            selector: '[?selectedSource]',
            style: {
              'background-color': blue[200]
            }
          },
          {
            selector: '[?selectedTarget]',
            style: {
              'background-color': red[200]
            }
          },
          {
            selector: '.ServiceLevel[?selectedSource]',
            style: {
              'background-color': el => impactSourceScale(el.data('impact'))
            }
          },
          {
            selector: '.ServiceLevel[?selectedTarget]',
            style: {
              'background-color': el => impactTargetScale(el.data('impact'))
            }
          },
          {
            selector: '[?selectedIncoming]',
            style: {
              'line-color': blue[200],
              'target-arrow-color': blue[200]
            }
          },
          {
            selector: '[?selectedOutgoing]',
            style: {
              'line-color': red[200],
              'target-arrow-color': red[200]
            }
          }
        ])
      } else {
        // Not selected element
        stylesheet = stylesheet.concat([
          {
            selector: '[?queryTarget]',
            style: {
              'background-color': red[900]
            }
          },
          {
            selector: '[?queryTargetSuccessor]',
            style: {
              'background-color': red[200]
            }
          },
          {
            selector: '[?queryTargetEdge]',
            style: {
              'line-color': red[200],
              'target-arrow-color': red[200]
            }
          }
        ])
      }
      stylesheet = stylesheet.concat([])
    } else {
      // Query Analysis
      stylesheet = stylesheet.concat([
        {
          selector: '[?queryTarget]',
          style: {
            'background-color': el => riskScale(parseFloat(el.data('queryTargetRisk').PROFESSIONAL))
          }
        },
        {
          selector: '[?queryTargetEdge]',
          style: {
            'line-color': el => riskScale(parseFloat(el.data('queryTargetRisk').PROFESSIONAL)),
            'target-arrow-color': el => riskScale(parseFloat(el.data('queryTargetRisk').PROFESSIONAL))
          }
        }
      ])
    }
    Object.entries(icons.businessEntitiesTypes.inline).forEach(([k, v]) => {
      stylesheet.push({
        selector: `.${k}`,
        style: {
          backgroundImage: icons.loadInlineSvg(v, style.dependencyGraph.iconsStyle)
        }
      })
    })
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithDependencyGraph
}

export default withDependencyGraph
