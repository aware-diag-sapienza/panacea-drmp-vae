'use strict'

const express = require('express')
const router = express.Router()

const { auth, loaders } = require('../../api')
const { initRes } = require('../helpers')

const getNetwork = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    network: req.network
  }
  res.json(data)
}

const getHuman = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    human: req.human
  }
  res.json(data)
}

const getInter = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    inter: req.inter
  }
  res.json(data)
}

const getBusiness = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    business: req.business
  }
  res.json(data)
}

const getBusinessMapping = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    businessMapping: req.businessMapping
  }
  res.json(data)
}

router.get('/getNetwork',
  auth.handlers.isAuthenticated,
  auth.handlers.hasNetworkPrivilege,
  loaders.handlers.getNetwork,
  getNetwork)

router.get('/getHuman',
  auth.handlers.isAuthenticated,
  auth.handlers.hasHumanPrivilege,
  loaders.handlers.getHuman,
  getHuman)

router.get('/getInter',
  auth.handlers.isAuthenticated,
  auth.handlers.hasNetworkPrivilege,
  auth.handlers.hasHumanPrivilege,
  loaders.handlers.getInter,
  getInter)

router.get('/getBusiness',
  auth.handlers.isAuthenticated,
  auth.handlers.hasBusinessPrivilege,
  loaders.handlers.getBusiness,
  getBusiness)

router.get('/getBusinessMapping',
  auth.handlers.isAuthenticated,
  auth.handlers.hasNetworkPrivilege,
  auth.handlers.hasBusinessPrivilege,
  loaders.handlers.getBusinessMapping,
  getBusinessMapping)

module.exports = router
