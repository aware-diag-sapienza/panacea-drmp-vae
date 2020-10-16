'use strict'

const mongoose = require('mongoose')

const conf = require('./conf')
const logger = require('./logger')

const init = () => {
  return new Promise((resolve, reject) => {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    mongoose.connect(conf.db.url, opts)
      .then(() => {
        logger.debug('Database connected')
        resolve(true)
      })
      .catch(err => {
        logger.debug('Database connection error: ', err)
        reject(err)
      })
  })
}

module.exports = {
  init
}
