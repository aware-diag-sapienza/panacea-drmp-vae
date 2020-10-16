'use strict'

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const users = require('../users')

passport.serializeUser((user, done) => done(null, user.username))

passport.deserializeUser(async (username, done) => {
  try {
    const user = await users.actions.getByKey('username', username)
    if (!user) return done(new Error(`User ${username} not found`))
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const passportAuthentication = async (username, password, done) => {
  try {
    const user = await users.actions.checkCredentials(username, password)
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

passport.use('local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    passportAuthentication
  )
)

const init = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports = {
  init
}
