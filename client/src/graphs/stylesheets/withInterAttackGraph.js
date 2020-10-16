import React from 'react'

const withInterAttackGraph = (Component) => {
  const WithInterAttackGraph = (props) => {
    let { stylesheet, ...other } = props
    if (!stylesheet) stylesheet = []
    return (
      <Component stylesheet={stylesheet} {...other} />
    )
  }
  return WithInterAttackGraph
}

export default withInterAttackGraph
