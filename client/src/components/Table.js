/* https://gist.github.com/antonfisher/d35156f83d148a2902bc60f937318e66
* React.js Material-UI Table and TableRow components with flexible height and fixed header
* - fixes "jumping" scrolling bar in WebKit browsers
* - shows permanent scrolling bar for other browsers
*
* Usage: import this Table and TableRow component instead of
*        'material-ui/Table' and 'material-ui/TableRow' component
*/

import React from 'react'
import PropTypes from 'prop-types'
import { Table as MuiTable, TableRow as MuiTableRow } from '@material-ui/core'

const isWebkit = ('WebkitAppearance' in document.documentElement.style)

export function Table ({ children, fixedHeader, wrapperStyle, headerStyle, bodyStyle, ...props }) {
  const combinedWrapperStyle = { overflowY: 'auto', minHeight: 100, ...wrapperStyle }
  const combinedHeaderStyle = headerStyle
  const combinedBodyStyle = { overflowY: 'none', ...bodyStyle }

  if (fixedHeader) {
    combinedWrapperStyle.display = 'flex'
    combinedWrapperStyle.flexDirection = 'column'
    combinedWrapperStyle.overflowY = 'none'
    if (isWebkit) {
      combinedBodyStyle.overflowY = 'overlay' // don't move content when scrollbar appears
    } else {
      combinedBodyStyle.overflowY = 'scroll' // fix firefox (it doesn't support overflow:"overlay" value)
      combinedHeaderStyle.paddingRight = 14
    }
  }

  return (
    <MuiTable
      fixedHeader={fixedHeader}
      wrapperStyle={combinedWrapperStyle}
      headerStyle={combinedHeaderStyle}
      bodyStyle={combinedBodyStyle}
      {...props}
    >
      {children}
    </MuiTable>
  )
}

Table.propTypes = {
  children: PropTypes.node.isRequired,
  fixedHeader: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  bodyStyle: PropTypes.object
}

Table.defaultProps = {
  fixedHeader: false,
  wrapperStyle: {},
  headerStyle: {},
  bodyStyle: {}
}

Table.muiName = 'Table'

export function TableRow ({ children, style, ...props }) {
  const combinedStyle = {
    borderRight: (isWebkit ? '15px solid rgba(0,0,0,0)' : 'none'), // fix padding when scrollbar appears
    ...style
  }

  return (
    <MuiTableRow style={combinedStyle} {...props}>
      {children}
    </MuiTableRow>
  )
}

TableRow.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
}

TableRow.defaultProps = {
  style: {},
  children: null
}

TableRow.muiName = 'TableRow'
