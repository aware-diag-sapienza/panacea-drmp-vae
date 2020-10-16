import React from 'react'
import { useSelector } from 'react-redux'
import { scaleSequential } from 'd3-scale'
import { pink } from '@material-ui/core/colors'

import schema from '../../schema'

const withHumanAttackGraph = (Component) => {
  const WithHumanAttackGraph = (props) => {
    let { stylesheet, ...other } = props
    const personsVulnerabilitiesMax = Math.max(...Object.entries(useSelector(schema.selectors.personsVulnerabilities)).map(([k, v]) => v.humanVulnerabilities.length))
    const personScale = scaleSequential()
      .domain([1, personsVulnerabilitiesMax])
      .range([pink[100], pink[700]])
    if (!stylesheet) stylesheet = []
    if (props.graphEncodings.nodesVulnerabilities) {
      stylesheet.push({
        selector: 'node.Person',
        style: {
          'background-color': el => el.data('numVulnerabilities') > 0 ? personScale(el.data('numVulnerabilities')) : 'white'
        }
      })
    }
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithHumanAttackGraph
}

export default withHumanAttackGraph
