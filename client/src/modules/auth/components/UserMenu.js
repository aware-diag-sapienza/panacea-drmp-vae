import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { IconButton, Menu, MenuItem, ListSubheader, ListItemIcon, ListItemText, Divider } from '@material-ui/core'
import { Person, Group, ExitToApp } from '@material-ui/icons'

import { isAuthenticated, getUsername, usersPrivilege } from '../selectors'
import { logout } from '../thunks'

const UserMenu = (props) => {
  const { Icon, menuProps, ...other } = props
  const isAuth = useSelector(isAuthenticated)
  const username = useSelector(getUsername)
  const usersP = useSelector(usersPrivilege)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleMenu = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const Header = (auth) =>
    <ListSubheader>
      {auth && username}
      {!auth && 'guest'}
    </ListSubheader>
  return (
    <>
      <IconButton onClick={handleMenu} {...other}>
        {Icon}
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          subheader: <Header auth={isAuth} />
        }}
      >
        <Divider />
        {isAuth && usersP &&
          <MenuItem component={RouterLink} to='/users'>
            <ListItemIcon><Group /></ListItemIcon>
            <ListItemText>Users</ListItemText>
          </MenuItem>}
        {isAuth &&
          <MenuItem onClick={() => dispatch(logout())}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>}
        {!isAuth &&
          <MenuItem component={RouterLink} to='/login'>Login</MenuItem>}
      </Menu>
    </>
  )
}

UserMenu.defaultProps = {
  Icon: <Person />,
  menuProps: {}
}

export default UserMenu
