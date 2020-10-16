import { createAction } from '@reduxjs/toolkit'
import { NAME } from './constants'

export const loadNetwork = createAction(`${NAME}/loadNetwork`)
export const loadHuman = createAction(`${NAME}/loadHuman`)
export const loadInter = createAction(`${NAME}/loadInter`)
export const loadBusiness = createAction(`${NAME}/loadBusiness`)
export const loadBusinessMapping = createAction(`${NAME}/loadBusinessMapping`)
