import React from 'react'
import { useSelector } from 'react-redux'
import { scaleSequential } from 'd3-scale'
import { pink } from '@material-ui/core/colors'

import schema from '../../schema'

const withNetworkAttackGraph = (Component) => {
  const WithNetworkAttackGraph = (props) => {
    // const theme = useTheme()
    let { stylesheet, ...other } = props
    const devicesVulnerabilitiesMax = Math.max(...Object.entries(useSelector(schema.selectors.devicesVulnerabilities)).map(([k, v]) => v.osVulnerabilities.length + v.localVulnerabilities.length + v.networkVulnerabilities.length))
    const deviceScale = scaleSequential()
      .domain([1, devicesVulnerabilitiesMax])
      .range([pink[100], pink[700]])
    if (!stylesheet) stylesheet = []
    if (props.graphEncodings.nodesVulnerabilities) {
      stylesheet.push({
        selector: 'node.Device',
        style: {
          'background-color': el => el.data('numVulnerabilities') > 0 ? deviceScale(el.data('numVulnerabilities')) : 'white'
        }
      })
    }
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithNetworkAttackGraph
}

export default withNetworkAttackGraph
