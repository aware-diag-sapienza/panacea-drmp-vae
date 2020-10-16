'use strict'

const express = require('express')
const HttpStatus = require('http-status-codes')

const { ErrorHandler } = require('../error')

const router = express.Router()
const error = (_req, _res, next) => next(new ErrorHandler(HttpStatus.NOT_FOUND, 'Invalid path'))
router.get('*', error)

module.exports = router
