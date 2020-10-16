'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')

const conf = require('./conf')

const init = () => {
  const app = express()
  const corsOptions = {
    origin: conf.client.url,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': conf.client.url,
    'Access-Control-Allow-Headers': true,
    'Access-Control-Expose-Headers': true,
    credentials: true
  }
  if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(conf.client.root))
    app.use('/static', express.static(conf.client.static))
    app.set('views', conf.client.root)
    app.engine('html', require('ejs').renderFile)
    app.set('view engine', 'html')
  }
  app.use(cookieParser(conf.redis.secret))
  app.use(bodyParser.json())
  app.use(cors(corsOptions))
  app.use(helmet())
  return app
}

module.exports = {
  init
}
