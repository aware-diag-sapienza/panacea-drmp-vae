'use strict'

const express = require('express')
const router = express.Router()

const { auth, queries } = require('../../api')
const { initRes } = require('../helpers')

const getQueries = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    queries: req.queries
  }
  res.json(data)
}

const getQueryOutput = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    queryOut: req.queryOut
  }
  res.json(data)
}

const postQuery = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    queryId: req.queryId
  }
  res.json(data)
}

router.get('/getQueries',
  auth.handlers.isAuthenticated,
  queries.handlers.getQueries,
  getQueries)

router.get('/getQueryOutput',
  // auth.handlers.isAuthenticated,
  queries.handlers.getQueryOutput,
  getQueryOutput
)

router.post('/postQuery',
  auth.handlers.isAuthenticated,
  queries.handlers.postQuery,
  postQuery
)

module.exports = router
