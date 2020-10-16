'use strict'

const index = (_req, res) => {
  if (process.env.NODE_ENV === 'production') res.render('index')
  else res.send('Server up')
}

module.exports = {
  index
}
