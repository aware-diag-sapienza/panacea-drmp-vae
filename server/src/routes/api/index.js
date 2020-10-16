'use strict'

const express = require('express')

const authRoute = require('./auth')
const usersRoute = require('./users')
const snapshotsRoute = require('./snapshots')
const loadersRoute = require('./loaders')
const queriesRoute = require('./queries')

const router = express.Router()
router.use('/auth', authRoute)
router.use('/users', usersRoute)
router.use('/snapshots', snapshotsRoute)
router.use('/loaders', loadersRoute)
router.use('/queries', queriesRoute)

module.exports = router
