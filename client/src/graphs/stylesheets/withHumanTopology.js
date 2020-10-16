import React from 'react'

import { icons } from '../../encodings'

const withHumanTopology = (Component) => {
  const WithHumanTopology = (props) => {
    let { stylesheet, ...other } = props
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'node.HumanElement',
        style: {
          shape: 'rectangle'
        }
      }
    ])
    Object.entries(icons.humansTypes.inline).forEach(([k, v]) => {
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
  return WithHumanTopology
}

export default withHumanTopology
