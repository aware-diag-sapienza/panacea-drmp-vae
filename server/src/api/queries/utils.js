'use strict'

const QUERY_OUTPUTS = [
  'impact',
  'likelihood',
  'path',
  'riskProfile'
]

const API_MAPPING = {
  queryInput: {
    port: 8112,
    relUrl: 'persistence/query/input'
  },
  queryOutput: {
    port: 8112,
    relUrl: 'persistence/query/output'
  }
}

const loadQueryOutput = (impact, likelihood, path, riskProfile) => {
  return {
    impact,
    likelihood,
    path,
    riskProfile
  }
}

module.exports = {
  QUERY_OUTPUTS,
  API_MAPPING,
  loadQueryOutput
}
