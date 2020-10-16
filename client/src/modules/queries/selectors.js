import { createSelector } from 'reselect'
import { createSelector as ormSelector } from 'redux-orm'
import { NAME } from './constants'

import schema from '../../schema'

export const slice = state => state[NAME]

export const isFetching = createSelector(
  slice,
  queries => queries.isFetching === true
)

export const isUpdated = createSelector(
  slice,
  queries => queries.isUpdated === true
)

export const getEntries = createSelector(
  slice,
  queries => queries.entries
)

export const getSelected = createSelector(
  slice,
  getEntries,
  (queries, entries) => {
    return queries.selected !== null
      ? entries[entries.map(s => s.id).indexOf(queries.selected)]
      : null
  }
)

export const isLoading = createSelector(
  slice,
  queries => queries.isLoading === true
)

export const handleQueryOutput = ormSelector(
  slice,
  getSelected,
  schema.orm,
  (queries, selected, { DevicePrivilege, PersonPrivilege, ServiceLevel }) => {
    const results = {
      attackGraph: {
        nodes: {},
        edges: {}
      },
      targets: [],
      riskProfile: {
        serviceLevels: []
      }
    }
    if (!selected || !selected.output) return results
    //
    selected.output.path.paths.forEach(pathEntry => {
      const pathNodes = []
      const pathEdges = []
      let interStepEntry = null
      let sourceId, targetId, edgeId
      pathEntry.steps.forEach(stepEntry => {
        const sourceEntry = stepEntry.source
        const targetEntry = stepEntry.destination
        if (targetEntry.split('@').length === 1) {
          interStepEntry = {
            sourceId: PersonPrivilege.withId(sourceEntry).person.id,
            credential: targetEntry
          }
        } else {
          if (sourceEntry.split('@').length === 1) {
            sourceId = interStepEntry.sourceId
            targetId = DevicePrivilege.withId(targetEntry).device.id
            edgeId = `${sourceId}-${interStepEntry.credential}-${targetId}`
            interStepEntry = null
          } else if (DevicePrivilege.idExists(sourceEntry) && DevicePrivilege.idExists(targetEntry)) {
            sourceId = DevicePrivilege.withId(sourceEntry).device.id
            targetId = DevicePrivilege.withId(targetEntry).device.id
            edgeId = `${sourceId}-att-${targetId}`
          } else if (PersonPrivilege.idExists(sourceEntry) && PersonPrivilege.idExists(targetEntry)) {
            sourceId = PersonPrivilege.withId(sourceEntry).person.id
            targetId = PersonPrivilege.withId(targetEntry).person.id
            edgeId = `${sourceId}-att-${targetId}`
          }
          //
          const newNodes = []
          if (results.attackGraph.nodes[sourceId] === undefined) newNodes.push(sourceId)
          if (results.attackGraph.nodes[targetId] === undefined && sourceId !== targetId) newNodes.push(targetId)
          newNodes.forEach(nodeId => {
            results.attackGraph.nodes[nodeId] = {
              id: nodeId,
              numPaths: 0,
              numSource: 0,
              numMiddle: 0,
              numTarget: 0,
              pathsProbabilities: {
                source: [],
                middle: [],
                target: []
              },
              incomingExploits: [],
              outgoingExploits: [],
              localExploits: []
            }
          })
          if (results.attackGraph.edges[edgeId] === undefined) {
            results.attackGraph.edges[edgeId] = {
              id: edgeId,
              numPaths: 0,
              pathsProbabilities: [],
              exploits: []
            }
          }
          pathNodes.push(sourceId)
          pathNodes.push(targetId)
          pathEdges.push(edgeId)
        }
      })
      const pathNodesUnique = [...new Set(pathNodes)]
      const pathEdgesUnique = [...new Set(pathEdges)]
      pathNodesUnique.forEach((nodeId, nodeIdx) => {
        results.attackGraph.nodes[nodeId].numPaths += 1
        if (nodeIdx === 0 && pathNodesUnique.length > 1) {
          results.attackGraph.nodes[nodeId].numSource += 1
          results.attackGraph.nodes[nodeId].pathsProbabilities.source.push(pathEntry.likelihood)
        } else if (nodeIdx === pathNodesUnique.length - 1) {
          results.attackGraph.nodes[nodeId].numTarget += 1
          results.attackGraph.nodes[nodeId].pathsProbabilities.target.push(pathEntry.likelihood)
        } else {
          results.attackGraph.nodes[nodeId].numMiddle += 1
          results.attackGraph.nodes[nodeId].pathsProbabilities.middle.push(pathEntry.likelihood)
        }
      })
      pathEdgesUnique.forEach(edgeId => {
        results.attackGraph.edges[edgeId].numPaths += 1
        results.attackGraph.edges[edgeId].pathsProbabilities.push(pathEntry.likelihood)
      })
    })
    selected.output.impact.forEach(impactEntry => {
      const serviceLevel = ServiceLevel.withId(impactEntry.serviceLevelId)
      const sourceServiceLevels = []
      const ATTACKERS = ['NAIVE', 'ADVANCED', 'PROFESSIONAL']
      ATTACKERS.forEach(a => {
        if (impactEntry.target[a] !== null) {
          const sl = DevicePrivilege.withId(impactEntry.target[a]).serviceLevel.id
          if (sourceServiceLevels.indexOf(sl) < 0) sourceServiceLevels.push(sl)
        }
      })
      const serviceLevelRisk = selected.output.riskProfile[impactEntry.serviceLevelId]
      results.riskProfile.serviceLevels.push({
        id: impactEntry.serviceLevelId,
        businessEntityId: serviceLevel.businessEntity.id,
        businessEntityName: serviceLevel.businessEntity.name,
        businessEntityType: serviceLevel.businessEntity.businessEntityType.id,
        confidentiality: serviceLevel.confidentialityLevel,
        integrity: serviceLevel.integrityLevel,
        availability: serviceLevel.availabilityLevel,
        impact: impactEntry.impact,
        target: impactEntry.target,
        sourceServiceLevels: sourceServiceLevels,
        risk: serviceLevelRisk
        // risk: { NAIVE: 0.00, ADVANCED: serviceLevelRisk.ADVANCED, PROFESSIONAL: serviceLevelRisk.PROFESSIONAL }
      })
    })
    for (const [targetId, likelihood] of Object.entries(selected.output.likelihood)) {
      results.targets.push({
        id: targetId,
        likelihood: likelihood
      })
    }
    return results
  }
)
