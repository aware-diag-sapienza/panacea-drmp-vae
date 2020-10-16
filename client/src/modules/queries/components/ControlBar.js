import React, { useState } from 'react'
import { IconButton, TextField, Typography, Divider, Menu, MenuItem } from '@material-ui/core'
import { MoreVert, Check, Clear, Delete, Add } from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1)
  },
  fill: {
    flex: 1
  }
}))

const ControlBar = ({ queries, currentQuery, queryName, handleQueryName, runQuery, clearQuery, deleteQuery, newQuery, selectQuery }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div className={classes.root}>
      <IconButton aria-controls='queries-menu' aria-haspopup='true' onClick={handleClick}><MoreVert /></IconButton>
      <Menu
        id='queries-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {queries.map(q =>
          <MenuItem key={q.id} onClick={() => { selectQuery(q.id); handleClose() }}>{q.name ? q.name : q.id}</MenuItem>
        )}
      </Menu>
      {currentQuery === null &&
        <>
          <TextField variant='outlined' onChange={handleQueryName} value={queryName} />
          <div className={classes.fill} />
          <IconButton onClick={runQuery}><Check /></IconButton>
          <IconButton onClick={clearQuery}><Clear /></IconButton>
        </>}
      {currentQuery !== null &&
        <>
          <Typography>{currentQuery.name !== null ? currentQuery.name : currentQuery.id}</Typography>
          <div className={classes.fill} />
          <IconButton onClick={deleteQuery}><Delete /></IconButton>
          <Divider orientation='vertical' />
          <IconButton onClick={newQuery}><Add /></IconButton>
        </>}
    </div>
  )
}

export default ControlBar
