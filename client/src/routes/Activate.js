import React from 'react'

import { BoxCentered } from '../pages'
import { auth } from '../modules'

export default () => (
  <BoxCentered title='Activate account'>
    <auth.C.Activate />
  </BoxCentered>
)
