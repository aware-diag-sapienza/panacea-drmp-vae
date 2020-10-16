'use strict'

const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  removable: {
    type: Boolean,
    required: true,
    default: false
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  activation: {
    type: String
  },
  password: {
    type: String
  },
  salt: {
    type: String
  },
  privileges: {
    users: {
      type: Boolean,
      required: true,
      default: false
    },
    network: {
      type: Boolean,
      required: true,
      default: false
    },
    human: {
      type: Boolean,
      required: true,
      default: false
    },
    business: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  created_at: Date,
  updated_at: Date
})

module.exports = mongoose.model('User', Schema)
