import React from 'react'
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  head: {
    fontWeight: theme.typography.fontWeightBold
  }
}))

const TablePlain = ({ columns, data, ...other }) => {
  const classes = useStyles()
  return (
    <TableContainer>
      <Table {...other}>
        <TableBody>
          {data.map(d =>
            <TableRow key={d.key}>
              <TableCell className={classes.head} variant='head'>{d.title}</TableCell>
              <TableCell>{d.value}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TablePlain
