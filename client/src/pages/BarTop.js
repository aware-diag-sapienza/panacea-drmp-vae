import React from 'react'
import clsx from 'clsx'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Drawer, IconButton, Link, SvgIcon } from '@material-ui/core'
import { Menu } from '@material-ui/icons'

import theme from '../theme'
import { auth } from '../modules'
import { RoutesMain } from '../containers'
import { ReactComponent as LogoIcon } from '../img/panacea-logo.svg'
import withPage from './withPage'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    minHeight: '100vh',
    height: props => props.height === undefined ? '100vh' : props.height,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  main: {
    flex: '1 0 auto',
    display: 'flex'
  },
  bar: {
    flex: '0 0 auto',
    display: 'flex'
  },
  logo: {
    height: '100%'
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  }
}))

const BarTop = (props) => {
  const { className, children, height = undefined, ...other } = props
  const classes = useStyles({ height })
  const [drawer, setDrawer] = React.useState(false)
  const toggleDrawer = (open) => setDrawer(open)
  return (
    <div className={clsx(classes.root, className)} {...other}>
      <AppBar className={classes.bar} position='static'>
        <Drawer anchor='left' open={drawer} onClose={() => toggleDrawer(false)}>
          <RoutesMain />
        </Drawer>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
          <Link
            className={classes.title}
            variant='h6'
            color='inherit'
            underline='none'
            component={RouterLink}
            to='/'
          >
            <SvgIcon component={LogoIcon} viewBox='0 0 479 806' />
            Panacea
          </Link>
          <theme.C.SwitchType color='inherit' />
          <auth.C.UserMenu color='inherit' />
        </Toolbar>
      </AppBar>
      <div className={classes.main}>
        {children}
      </div>
    </div>
  )
}

export default withPage(BarTop)
