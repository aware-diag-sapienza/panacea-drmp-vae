'use strict'

const express = require('express')
const router = express.Router()

const { auth, snapshots } = require('../../api')
const { initRes } = require('../helpers')

const getAll = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    snapshots: req.snapshots
  }
  res.json(data)
}

router.get('/getAll',
  auth.handlers.isAuthenticated,
  snapshots.handlers.getAll,
  getAll)

module.exports = router
