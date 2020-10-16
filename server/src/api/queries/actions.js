'use strict'

const axios = require('axios')

const config = require('../../config')
const { API_MAPPING, QUERY_OUTPUTS, loadQueryOutput } = require('./utils')

const BASE_URL = config.conf.storage.url

const getQueries = (snapshotId) => {
  const entry = API_MAPPING.queryInput
  const url = config.conf.storage.customPorts
    ? `${BASE_URL}:${entry.port}/${entry.relUrl}/${snapshotId}`
    : `${BASE_URL}/${entry.relUrl}/${snapshotId}`
  return axios.get(url)
    .then(res => Promise.resolve(res.data))
    .catch(err => {
      // TODO: ask to return an empty array when there are no queries
      console.log(err)
      Promise.resolve([])
      // Promise.reject(err)
    })
}

const getQueryOutput = (snapshotId, queryId) => {
  const entry = API_MAPPING.queryOutput
  const url = config.conf.storage.customPorts
    ? `${BASE_URL}:${entry.port}/${entry.relUrl}/${snapshotId}/${queryId}`
    : `${BASE_URL}/${entry.relUrl}/${snapshotId}/${queryId}`
  return new Promise((resolve, reject) => {
    Promise.all(QUERY_OUTPUTS.map(o => axios.get(`${url}/${o}`)))
      .then(outputs => {
        const result = loadQueryOutput(...outputs.map(o => o.data))
        resolve(result)
      })
      .catch(err => reject(err))
  })
}

const postQuery = (snapshotId, query) => {
  const entry = API_MAPPING.queryInput
  const url = config.conf.storage.customPorts
    ? `${BASE_URL}:${entry.port}/${entry.relUrl}/${snapshotId}`
    : `${BASE_URL}/${entry.relUrl}/${snapshotId}`
  return axios.post(url, query)
    .then(res => Promise.resolve(res.data))
    .catch(err => Promise.reject(err))
}

module.exports = {
  getQueries,
  getQueryOutput,
  postQuery
}
