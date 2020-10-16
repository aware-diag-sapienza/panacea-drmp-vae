'use strict'

const crypto = require('crypto')

const User = require('./model')
const { createHash } = require('./helpers')

const getByKey = (key, value) => {
  return new Promise((resolve, reject) => {
    if (!key) reject(new Error('Missing key'))
    if (!value) reject(new Error('Missing value'))
    const query = {}
    query[key] = value
    User.findOne(query)
      .then(user => {
        resolve(user)
      })
      .catch(err => reject(err))
  })
}

const getAll = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .then(users => resolve(users))
      .catch(err => reject(err))
  })
}

const checkCredentials = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!username || !password) reject(new Error('Missing username or password'))
    getByKey('username', username)
      .then(user => {
        if (user === null) reject(new Error(`User '${username}' not found`))
        const salt = user.salt
        const hash = createHash(password, salt)
        if (user.password === hash) resolve(user)
        else resolve(false)
      })
      .catch(e => reject(e))
  })
}

const register = (username, removable = undefined, privileges = undefined) => {
  return new Promise((resolve, reject) => {
    if (!username) reject(new Error('Missing username'))
    getByKey('username', username)
      .then(user => {
        if (user !== null) reject(new Error(`User '${username}' already exists`))
        const id = crypto.createHmac('sha512', username).digest('hex')
        const activation = crypto.randomBytes(16).toString('hex')
        const document = new User({
          id,
          username,
          activation
        })
        if (removable !== undefined) document.removable = removable
        if (privileges !== undefined) document.privileges = privileges
        document.save()
          .then(user => resolve(user))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const updatePrivileges = (username, privileges) => {
  return new Promise((resolve, reject) => {
    if (!username) reject(new Error('Missing username'))
    if (!privileges) reject(new Error('Missing privileges'))
    getByKey('username', username)
      .then(user => {
        if (user === null) reject(new Error(`User '${username}' not found`))
        if (user.removable === false) reject(new Error(`User '${username}' not updatable`))
        user.privileges = privileges
        user.save()
          .then(user => resolve(user))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const remove = (username, force = false) => {
  return new Promise((resolve, reject) => {
    if (!username) reject(new Error('Missing username'))
    getByKey('username', username)
      .then(user => {
        if (user === null) reject(new Error(`User '${username}' not found`))
        if (user.removable === false && !force) reject(new Error(`User '${username}' not updatable`))
        User.deleteOne({ username: username })
          .then(() => resolve())
          .catch(e => reject(e))
      })
  })
}

module.exports = {
  getByKey,
  getAll,
  checkCredentials,
  register,
  updatePrivileges,
  remove
}
