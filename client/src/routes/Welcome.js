import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography } from '@material-ui/core'
import { LoremIpsum } from 'lorem-ipsum'

import { BoxCentered } from '../pages'
import { ButtonPrimary } from '../components'

export default () => {
  const lorem = new LoremIpsum()
  return (
    <BoxCentered title='Welcome to the PANACEA DRMP'>
      <Typography variant='body1' align='justify'>
        {lorem.generateParagraphs(2)}
      </Typography>
      <Box
        width={1}
        display='flex'
        flexDirection='row'
        flexWrap='wrap'
        justifyContent='space-evenly'
        alignItems='center'
        p={4}
      >
        <ButtonPrimary component={RouterLink} to='/login'>Login</ButtonPrimary>
        <ButtonPrimary component={RouterLink} to='/activate'>Activate</ButtonPrimary>
      </Box>
    </BoxCentered>
  )
}
