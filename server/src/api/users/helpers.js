'use strict'

const crypto = require('crypto')

const createSalt = (length) => crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)

const createHash = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('hex')
}

const createPasswordHash = (password) => {
  if (!password) return false
  const salt = createSalt(16)
  const hash = createHash(password, salt)
  return {
    salt,
    hash
  }
}

module.exports = {
  createHash,
  createPasswordHash
}
