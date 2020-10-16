'use strict'

const axios = require('axios')

let layout, dependencyLayout
try {
  layout = require('../../data/layout.json')
} catch {
  layout = {}
}
try {
  dependencyLayout = require('../../data/dependencyLayout.json')
} catch {
  dependencyLayout = {}
}

const config = require('../../config')
const { API_MAPPING, loadNetwork, loadHuman, loadInter, loadBusiness, loadBusinessMapping } = require('./utils')

const BASE_URL = config.conf.storage.url

const fetchData = (snapshotId, entryName) => {
  const entry = API_MAPPING[entryName]
  const url = config.conf.storage.customPorts
    ? `${BASE_URL}:${entry.port}/${entry.relUrl}/${snapshotId}`
    : `${BASE_URL}/${entry.relUrl}/${snapshotId}`
  return axios.get(url)
    .then(res => Promise.resolve(res.data))
    .catch(err => Promise.reject(err))
}

const getNetwork = (snapshotId) => {
  const files = ['vulnerabilityCatalog', 'deviceInventory', 'reachabilityInventory', 'networkAttackGraph']
  return new Promise((resolve, reject) => {
    Promise.all(files.map(f => fetchData(snapshotId, f)))
      .then(values => {
        loadNetwork(...values, layout)
          .then(network => resolve(network))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const getHuman = (snapshotId) => {
  const files = [
    'humanVulnerabilityCatalog',
    'employeeInventory',
    'humanVulnerabilityInventory',
    'humanReachabilityInventory',
    'cyberSecurityProfileInventory',
    'humanPolicyInventory',
    'humanAttackGraph'
  ]
  return new Promise((resolve, reject) => {
    Promise.all(files.map(f => fetchData(snapshotId, f)))
      .then(values => {
        loadHuman(...values, layout)
          .then(human => resolve(human))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const getInter = (snapshotId) => {
  const files = ['credentialInventory', 'interAttackGraph']
  return new Promise((resolve, reject) => {
    Promise.all(files.map(f => fetchData(snapshotId, f)))
      .then(values => {
        loadInter(...values)
          .then(inter => resolve(inter))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const getBusiness = (snapshotId) => {
  const files = ['businessConfiguration', 'businessEntityInventory', 'serviceLevelInventory']
  return new Promise((resolve, reject) => {
    Promise.all(files.map(f => fetchData(snapshotId, f)))
      .then(values => {
        loadBusiness(...values, dependencyLayout)
          .then(business => resolve(business))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

const getBusinessMapping = (snapshotId) => {
  const files = ['businessNetworkMapping']
  return new Promise((resolve, reject) => {
    Promise.all(files.map(f => fetchData(snapshotId, f)))
      .then(values => {
        loadBusinessMapping(...values)
          .then(businessMapping => resolve(businessMapping))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getNetwork,
  getHuman,
  getInter,
  getBusiness,
  getBusinessMapping
}
