import React from 'react'
import { blueGrey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/core/styles'

import { icons } from '../../encodings'

const withHuman = (Component) => {
  const WithHuman = (props) => {
    const theme = useTheme()
    let { stylesheet, ...other } = props
    if (!stylesheet) stylesheet = []
    stylesheet = stylesheet.concat([
      {
        selector: 'node',
        style: {
          'background-color': blueGrey[200],
          label: el => el.data('label').split(' ').pop(),
          color: theme.palette.text.primary,
          'border-width': 1,
          'border-color': blueGrey[400]
        }
      },
      {
        selector: 'edge',
        style: {
          'line-color': blueGrey[200],
          opacity: 0.8
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
  return WithHuman
}

export default withHuman
