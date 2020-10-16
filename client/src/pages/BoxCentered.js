import React from 'react'
import clsx from 'clsx'
import { Link as RouterLink } from 'react-router-dom'
import { Paper, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import logo from '../img/panacea-396x128.png'
import withPage from './withPage'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    width: theme.breakpoints.values.sm,
    position: 'relative',
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2)
  }
}))

const BoxCentered = (props) => {
  const { className, title, children, ...other } = props
  const classes = useStyles()
  return (
    <Container className={clsx(classes.root, className)} {...other}>
      <Paper className={classes.box}>
        <RouterLink to='/'>
          <img className={classes.image} src={logo} alt='Logo' />
        </RouterLink>
        <Typography className={classes.title} variant='h4' align='center'>
          {title}
        </Typography>
        {children}
      </Paper>
    </Container>
  )
}

export default withPage(BoxCentered)
