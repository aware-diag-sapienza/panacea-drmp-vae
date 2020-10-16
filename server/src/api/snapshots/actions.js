'use strict'

const axios = require('axios')

const config = require('../../config')

const BASE_URL = config.conf.storage.url
const PORT = 8099
const REL_URL = 'orchestrator/getAllSnapshots'

const getAll = () => {
  const url = config.conf.storage.customPorts
    ? `${BASE_URL}:${PORT}/${REL_URL}`
    : `${BASE_URL}/${REL_URL}`
  return axios.get(url)
    .then(res => Promise.resolve(res.data.map(s => ({ id: s.snapshotId, timestamp: s.snapshotTime })).sort((x, y) => Date.parse(y.timestamp) - Date.parse(x.timestamp))))
    .catch(err => Promise.reject(err))
}

module.exports = {
  getAll
}
