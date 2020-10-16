import React from 'react'

const withInterTopology = (Component) => {
  const WithInterTopology = (props) => {
    let { stylesheet, ...other } = props
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'edge.PersonCredDevice',
        style: {
          'curve-style': 'bezier'
        }
      }
    ])
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithInterTopology
}

export default withInterTopology
