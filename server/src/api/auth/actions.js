'use strict'

const passport = require('passport')

const users = require('../users')

const activate = (activation, password) => {
  return new Promise((resolve, reject) => {
    if (!activation || !password) reject(new Error('Missing activation code or password'))
    users.actions.getByKey('activation', activation)
      .then(user => {
        if (user === null) reject(new Error(`User with activation '${activation}' not found`))
        if (user.active === true) reject(new Error('User already activated'))
        const { hash, salt } = users.helpers.createPasswordHash(password)
        user.active = true
        user.activation = ''
        user.password = hash
        user.salt = salt
        user.save()
          .then(user => resolve(user))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const login = (req, res) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'local',
      { session: true },
      (err, user) => {
        if (err) reject(err)
        if (!user) reject(new Error('User not authenticated'))
        req.login(user, err => {
          if (err) reject(err)
          resolve(user)
        })
      })(req, res)
  })
}

const logout = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const user = { username: req.user.username }
      req.logout()
      req.user = user
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  activate,
  login,
  logout
}
