import React from 'react'

import DeviceTip from './DeviceTip'
import PersonTip from './PersonTip'

const TopologyTip = (props) => {
  const { model, id, selectedModel, selectedId, queryResults } = props
  if (model === 'Device') {
    return (<DeviceTip context='AttackGraph' id={id} selectedModel={selectedModel} selectedId={selectedId} queryResults={queryResults} />)
  } else if (model === 'Person') {
    return (<PersonTip context='AttackGraph' id={id} selectedModel={selectedModel} selectedId={selectedId} queryResults={queryResults} />)
  } else {
    return (<div>{id}</div>)
  }
}

export default TopologyTip
