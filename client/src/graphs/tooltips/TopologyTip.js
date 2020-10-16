import React from 'react'

import DeviceTip from './DeviceTip'
import PersonTip from './PersonTip'

const TopologyTip = (props) => {
  const { model, id, selectedModel, selectedId } = props
  if (model === 'Device') {
    return (<DeviceTip context='Topology' id={id} selectedModel={selectedModel} selectedId={selectedId} />)
  } else if (model === 'Person') {
    return (<PersonTip context='Topology' id={id} selectedModel={selectedModel} selectedId={selectedId} />)
  } else {
    return (<div>{id}</div>)
  }
}

export default TopologyTip
