'use strict'

const express = require('express')
const router = express.Router()

const { auth } = require('../../api')
const { initRes } = require('../helpers')

const activate = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    user: req.userActivated
  }
  res.json(data)
}

const login = (req, res, _next) => {
  const data = initRes(req, res)
  const { id, username, privileges } = req.user
  data.payload = {
    id,
    username,
    privileges,
    session: req.sessionID
  }
  res.json(data)
}

const logout = (req, res, _next) => {
  const data = initRes(req, res)
  res.json(data)
}

router.put('/activate',
  auth.handlers.activate,
  activate)
router.post('/login',
  auth.handlers.login,
  login)
router.post('/logout',
  auth.handlers.isAuthenticated,
  auth.handlers.logout,
  logout)

module.exports = router
