import React from 'react'

import { icons } from '../../encodings'

const withNetworkTopology = (Component) => {
  const WithNetworkTopology = (props) => {
    let { stylesheet, ...other } = props
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'node.NetworkElement',
        style: {
          shape: 'ellipse'
        }
      }
    ])
    Object.entries(icons.devicesTypes.inline).forEach(([k, v]) => {
      stylesheet.push({
        selector: `.${k}`,
        style: {
          backgroundImage: icons.loadInlineSvg(v, {})
        }
      })
    })
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithNetworkTopology
}

export default withNetworkTopology
