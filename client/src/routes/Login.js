import React from 'react'

import { BoxCentered } from '../pages'
import { auth } from '../modules'

export default () => (
  <BoxCentered title='Login to continue'>
    <auth.C.Login />
  </BoxCentered>
)
