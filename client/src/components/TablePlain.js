import React from 'react'
import { TableHead, TableCell, TableBody, Table, TableRow } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'auto',
    maxWidth: props => `${props.width}px`
  },
  headTable: {
    tableLayout: 'fixed'
  },
  head: {

  },
  headCell: {
    fontWeight: theme.typography.fontWeightBold
  },
  bodyContainer: {
    overflow: 'auto',
    maxHeight: props => `${props.height}px`
  },
  bodyTable: {
    tableLayout: 'fixed'
  },
  body: {

  },
  bodyCell: {

  },
  cellContainer: {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 1)
  }
}))

const TablePlain = ({ columns, data, height = 200, width = 400, widthColumns = [], ...other }) => {
  const classes = useStyles({ height, width, columns })
  return (
    <div className={classes.container}>
      <Table className={classes.headTable} {...other}>
        <TableHead className={classes.head}>
          <TableRow>
            {columns.map((col, idx) =>
              <TableCell
                key={col.field}
                className={classes.headCell}
                style={{ width: widthColumns.length > 0 ? `${widthColumns[idx]}%` : 'auto' }}
              >
                <div className={classes.cellContainer} style={{ width: widthColumns.length > 0 ? `${width * widthColumns[idx] / 100}px` : 'auto' }}>{col.title}</div>
              </TableCell>)}
          </TableRow>
        </TableHead>
      </Table>
      <div className={classes.bodyContainer}>
        <Table className={classes.bodyTable} {...other}>
          <TableBody className={classes.body}>
            {data.map(d => {
              const { rowProps } = d
              return (
                <TableRow key={d.key} {...rowProps}>
                  {columns.map((col, idx) =>
                    <TableCell
                      key={col.field}
                      className={classes.bodyCell}
                      style={{ width: widthColumns.length > 0 ? `${widthColumns[idx]}%` : 'auto' }}
                    >
                      <div className={classes.cellContainer} style={{ width: widthColumns.length > 0 ? `${width * widthColumns[idx] / 100}px` : 'auto' }}>{d[col.field]}</div>
                    </TableCell>)}
                </TableRow>)
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TablePlain
