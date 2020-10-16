'use strict'

const express = require('express')
const router = express.Router()

const { auth, users } = require('../../api')
const { initRes } = require('../helpers')

const getAll = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    users: req.users
  }
  res.json(data)
}

const register = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    user: req.userRegistered
  }
  res.json(data)
}

const updatePrivileges = (req, res, _next) => {
  const data = initRes(req, res)
  data.payload = {
    user: req.userUpdated
  }
  res.json(data)
}

const remove = (req, res, _next) => {
  const data = initRes(req, res)
  res.json(data)
}

router.get('/getAll',
  auth.handlers.isAuthenticated,
  auth.handlers.hasUsersPrivilege,
  users.handlers.getAll,
  getAll)
router.post('/register',
  auth.handlers.isAuthenticated,
  auth.handlers.hasUsersPrivilege,
  users.handlers.register,
  register)
router.put('/updatePrivileges',
  auth.handlers.isAuthenticated,
  auth.handlers.hasUsersPrivilege,
  users.handlers.updatePrivileges,
  updatePrivileges)
router.delete('/remove',
  auth.handlers.isAuthenticated,
  auth.handlers.hasUsersPrivilege,
  users.handlers.remove,
  remove)

module.exports = router
