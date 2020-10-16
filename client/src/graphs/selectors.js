import { createSelector } from 'reselect'
import { createSelector as ormSelector } from 'redux-orm'

import { pairs } from '../utils'
import { icons } from '../encodings'
import schema from '../schema'

export const getNetworkTopology = ormSelector(
  (state, _) => schema.selectors.devices(state),
  (state, _) => schema.selectors.subnetsIfaces(state),
  (_, hideSubnets) => hideSubnets,
  schema.orm,
  (devices, subnetsIfaces, hideSubnets, { Device, Subnet }) => {
    const nodes = [
      ...devices.map(device => ({
        data: {
          id: device.id,
          label: Device.withId(device.id).toString(),
          model: 'Device',
          name: device.name,
          type: device.type
        },
        position: {
          x: Device.withId(device.id).position.x,
          y: Device.withId(device.id).position.y
        },
        classes: ['Topology', 'NetworkElement', 'Device', icons.devicesTypes.img[device.type] !== undefined ? device.type : 'UnknownNetwork']
      }))
    ]
    const edges = []
    subnetsIfaces.forEach(subnetIfaces => {
      if (!hideSubnets || (subnetIfaces.ifaces.length < hideSubnets[0] || subnetIfaces.ifaces.length > hideSubnets[1])) {
        nodes.push({
          data: {
            id: subnetIfaces.id,
            label: Subnet.withId(subnetIfaces.id).toString(),
            model: 'Subnet'
          },
          position: {
            x: Subnet.withId(subnetIfaces.id).position.x,
            y: Subnet.withId(subnetIfaces.id).position.y
          },
          classes: ['Topology', 'NetworkElement', 'Subnet']
        })
        subnetIfaces.ifaces.forEach(iface => {
          const source = iface.device
          const target = subnetIfaces.id
          edges.push({
            data: {
              id: `${source}-${target}`,
              source,
              target
            },
            classes: ['Topology', 'NetworkElement', 'DeviceNetSubnet']
          })
        })
      } else {
        pairs(subnetIfaces.ifaces).forEach(pair => {
          const source = pair[0].device
          const target = pair[1].device
          edges.push({
            data: {
              id: `${source}-${target}`,
              source,
              target
            },
            classes: ['Topology', 'NetworkElement', 'DeviceNetDevice']
          })
        })
      }
    })
    return { nodes, edges }
  }
)

export const getHumanTopology = ormSelector(
  (_, employeeOnly) => employeeOnly,
  (state, _) => schema.selectors.personsType(state),
  schema.orm,
  (employeeOnly, personsType, { Person }) => {
    const persons = employeeOnly === undefined
      ? personsType
      : personsType.filter(p => Person.withId(p.id).affiliation === 'employee')
    const nodes = [
      // ...personsType.filter(p => Person.withId(p.id).affiliation === 'employee').map(person => ({
      ...persons.map(person => ({
        data: {
          id: person.id,
          label: Person.withId(person.id).toString(),
          model: 'Person',
          name: Person.withId(person.id).name,
          type: person.type
        },
        position: {
          x: Person.withId(person.id).position.x,
          y: Person.withId(person.id).position.y
        },
        classes: ['Topology', 'HumanElement', 'Person', icons.humansTypes.img[person.type] !== undefined ? person.type : 'UnknownHuman']
      }))
    ]
    const edges = []
    return { nodes, edges }
  }
)

export const getInterTopology = createSelector(
  schema.selectors.credentialsPersonDevicePrivileges,
  (credentialsPersonDevicePrivileges) => {
    const nodes = []
    const edges = []
    credentialsPersonDevicePrivileges.forEach(credential => {
      const source = credential.person.id
      credential.devicePrivileges.forEach(devicePrivilege => {
        const target = devicePrivilege.device
        edges.push({
          data: {
            id: `${source}-${target}`,
            source,
            target
          },
          classes: ['Topology', 'InterElement', 'PersonCredDevice']
        })
      })
    })
    return { nodes, edges }
  }
)

export const getTopology = createSelector(
  (state, _network, _human, hideSubnets, _employeeOnly) => getNetworkTopology(state, hideSubnets),
  (state, _network, _human, _hideSubnets, employeeOnly) => getHumanTopology(state, employeeOnly),
  (state, _network, _human, _hideSubnets, _employeeOnly) => getInterTopology(state),
  (_state, network, human, _hideSubnets, _employeeOnly) => ({ network, human }),
  (networkTopology, humanTopology, interTopology, visibility) => {
    const nodes = [
      ...(visibility.network ? networkTopology.nodes : []),
      ...(visibility.human ? humanTopology.nodes : []),
      ...(visibility.network && visibility.human ? interTopology.nodes : [])
    ]
    const edges = [
      ...(visibility.network ? networkTopology.edges : []),
      ...(visibility.human ? humanTopology.edges : []),
      ...(visibility.network && visibility.human ? interTopology.edges : [])
    ]
    return { nodes, edges }
  }
)

export const getNetworkAttackGraph = ormSelector(
  (state, hideSubnets, _expandedDevices) => getNetworkTopology(state, hideSubnets),
  (_state, _hideSubnets, expandedDevices) => expandedDevices,
  (state, _hideSubnets, _expandedDevices) => schema.selectors.devicesDevicePrivileges(state),
  schema.orm,
  (networkTopology, expandedDevices, devicesDevicePrivileges, { DevicePrivilege }) => {
    const nodes = [...networkTopology.nodes]
    const edges = [...networkTopology.edges]
    devicesDevicePrivileges.forEach(deviceDevicePrivileges => {
      deviceDevicePrivileges.devicePrivileges.forEach(devicePrivilege => {
        if (expandedDevices.indexOf(deviceDevicePrivileges.id) > -1) {
          nodes.push({
            data: {
              id: devicePrivilege.id,
              label: devicePrivilege.level[0],
              model: 'DevicePrivilege'
            },
            parent: deviceDevicePrivileges.id,
            classes: ['AttackGraph', 'NetworkElement', 'DevicePrivilege']
          })
        }
        DevicePrivilege.withId(devicePrivilege.id).networkStepsOutgoing.toModelArray().forEach(networkStep => {
          const source = devicePrivilege.device
          const target = expandedDevices.indexOf(networkStep.devicePrivilegeTarget.device) < 0
            ? networkStep.devicePrivilegeTarget.device.id
            : networkStep.devicePrivilegeTarget.id
          if (edges.map(e => e.data.id).indexOf(`${source}-att-${target}`) < 0) {
            // TODO: remove following if for privilege escalation
            if (source !== target) {
              edges.push({
                data: {
                  id: `${source}-att-${target}`,
                  source,
                  target
                },
                classes: ['AttackGraph', 'NetworkElement', 'DeviceAttDevice']
              })
            }
          }
        })
      })
    })
    return { nodes, edges }
  }
)

export const getHumanAttackGraph = ormSelector(
  (state, _expandedPersons) => getHumanTopology(state),
  (_state, expandedPersons) => expandedPersons,
  (state, _expandedPersons) => schema.selectors.personsPersonPrivileges(state),
  schema.orm,
  (humanTopology, expandedPersons, personsPersonPrivileges, { PersonPrivilege }) => {
    const nodes = [...humanTopology.nodes]
    const edges = [...humanTopology.edges]
    personsPersonPrivileges.forEach(personPersonPrivileges => {
      personPersonPrivileges.personPrivileges.forEach(personPrivilege => {
        if (expandedPersons.indexOf(personPersonPrivileges.id) > -1) {
          nodes.push({
            data: {
              id: personPrivilege.id,
              label: personPrivilege.level[0],
              model: 'PersonPrivilege'
            },
            parent: personPersonPrivileges.id,
            classes: ['AttackGraph', 'HumanElement', 'PersonPrivilege']
          })
        }
        PersonPrivilege.withId(personPrivilege.id).humanStepsOutgoing.toModelArray().forEach(humanStep => {
          const source = personPrivilege.person
          const target = expandedPersons.indexOf(humanStep.personPrivilegeTarget.person) < 0
            ? humanStep.personPrivilegeTarget.person.id
            : humanStep.personPrivilegeTarget.id
          if (edges.map(e => e.data.id).indexOf(`${source}-att-${target}`) < 0) {
            edges.push({
              data: {
                id: `${source}-att-${target}`,
                source,
                target
              },
              classes: ['AttackGraph', 'HumanElement', 'PersonAttPerson']
            })
          }
        })
      })
    })
    return { nodes, edges }
  }
)

export const getInterAttackGraph = ormSelector(
  (state, _expandedDevices, _expandedPersons) => schema.selectors.interSteps(state),
  (state, _expandedDevices, _expandedPersons) => getInterTopology(state),
  (_state, expandedDevices, _expandedPersons) => expandedDevices,
  (_state, _expandedDevices, expandedPersons) => expandedPersons,
  schema.orm,
  (interSteps, interTopology, expandedDevices, expandedPersons, { PersonPrivilege, DevicePrivilege }) => {
    const nodes = [...interTopology.nodes]
    const edges = [...interTopology.edges]
    interSteps.forEach(interStep => {
      const source = expandedPersons.indexOf(interStep.personPrivilegeSource) < 0
        ? PersonPrivilege.withId(interStep.personPrivilegeSource).person.id
        : interStep.personPrivilegeSource
      const target = expandedDevices.indexOf(interStep.devicePrivilegeTarget) < 0
        ? DevicePrivilege.withId(interStep.devicePrivilegeTarget).device.id
        : interStep.devicePrivilegeTarget
      const credential = interStep.credential
      if (edges.map(e => e.data.id).indexOf(`${source}-${credential}-${target}`) < 0) {
        edges.push({
          data: {
            id: `${source}-${credential}-${target}`,
            source,
            target
          },
          classes: ['AttackGraph', 'InterElement', 'PersonAttDevice']
        })
      }
    })
    return { nodes, edges }
  }
)

export const getAttackGraph = createSelector(
  (state, _network, _human, hideSubnets, expandedDevices, _expandedPersons) => getNetworkAttackGraph(state, hideSubnets, expandedDevices),
  (state, _network, _human, _hideSubnets, _expandedDevices, expandedPersons) => getHumanAttackGraph(state, expandedPersons),
  (state, _network, _human, _hideSubnets, expandedDevices, expandedPersons) => getInterAttackGraph(state, expandedDevices, expandedPersons),
  (state, _network, _human, _hideSubnets, _expandedDevices, _expandedPersons) => schema.selectors.devicesVulnerabilities(state),
  (state, _network, _human, _hideSubnets, _expandedDevices, _expandedPersons) => schema.selectors.personsVulnerabilities(state),
  (_state, network, human, _hideSubnets, _expandedDevices, _expandedPersons) => ({ network, human }),
  (networkAttackGraph, humanAttackGraph, interAttackGraph, devicesVulnerabilities, personsVulnerabilities, visibility) => {
    const nodes = [
      ...(visibility.network ? networkAttackGraph.nodes.filter(n => n.classes.includes('Device')).map(node => (
        {
          ...node,
          data: {
            ...node.data,
            numVulnerabilities: devicesVulnerabilities[node.data.id].osVulnerabilities.length + devicesVulnerabilities[node.data.id].localVulnerabilities.length + devicesVulnerabilities[node.data.id].networkVulnerabilities.length
          }
        })
      ) : []),
      ...(visibility.network ? networkAttackGraph.nodes.filter(n => (!n.classes.includes('Device'))) : []),
      ...(visibility.human ? humanAttackGraph.nodes.filter(n => n.classes.includes('Person')).map(node => (
        {
          ...node,
          data: {
            ...node.data,
            numVulnerabilities: personsVulnerabilities[node.data.id].humanVulnerabilities.length
          }
        })
      ) : []),
      ...(visibility.human ? humanAttackGraph.nodes.filter(n => (!n.classes.includes('Person'))) : []),
      ...(visibility.network && visibility.human ? interAttackGraph.nodes : [])
    ]
    const edges = [
      ...(visibility.network ? networkAttackGraph.edges : []),
      ...(visibility.human ? humanAttackGraph.edges : []),
      ...(visibility.network && visibility.human ? interAttackGraph.edges : [])
    ]
    return { nodes, edges }
  }
)

export const handleQueryResponse = ormSelector(
  (_state, response) => response,
  schema.orm,
  (response, { DevicePrivilege, PersonPrivilege }) => {
    if (!response || !response.paths) return null
    const results = {
      nodes: {},
      edges: {}
    }
    let sourceId, targetId, edgeId
    response.paths.forEach(pathEntry => {
      const pathNodes = []
      const pathEdges = []
      let interStepEntry = null
      pathEntry.forEach(stepEntry => {
        const sourceEntry = stepEntry[0]
        const targetEntry = stepEntry[2]
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
          if (results.nodes[sourceId] === undefined) {
            results.nodes[sourceId] = {
              id: sourceId,
              numPaths: 0,
              numSource: 0,
              numMiddle: 0,
              numTarget: 0,
              incomingExploits: [],
              outgoingExploits: [],
              localExploits: []
            }
          }
          if (results.nodes[targetId] === undefined) {
            results.nodes[targetId] = {
              id: targetId,
              numPaths: 0,
              numSource: 0,
              numMiddle: 0,
              numTarget: 0,
              incomingExploits: [],
              outgoingExploits: [],
              localExploits: []
            }
          }
          if (results.edges[edgeId] === undefined) {
            results.edges[edgeId] = {
              id: edgeId,
              numPaths: 0,
              exploits: []
            }
          }
          // TODO: remove following if for privilege escalation
          if (sourceId !== targetId) {
            pathNodes.push(sourceId)
            pathNodes.push(targetId)
            pathEdges.push(edgeId)
          }
        }
      })
      const pathNodesUnique = [...new Set(pathNodes)]
      const pathEdgesUnique = [...new Set(pathEdges)]
      pathNodesUnique.forEach((nodeId, nodeIdx) => {
        results.nodes[nodeId].numPaths += 1
        if (nodeIdx === 0 && pathNodesUnique.length > 1) results.nodes[nodeId].numSource += 1
        else if (nodeIdx === pathNodesUnique.length - 1) results.nodes[nodeId].numTarget += 1
        else results.nodes[nodeId].numMiddle += 1
      })
      pathEdgesUnique.forEach(edgeId => {
        results.edges[edgeId].numPaths += 1
      })
    })
    return results
  }
)

export const getDependencyGraph = ormSelector(
  (state) => schema.selectors.businessEntitiesServiceLevels(state),
  (state) => schema.selectors.serviceDependencies(state),
  schema.orm,
  (businessEntitiesServiceLevels, serviceDependencies, { BusinessEntity, ServiceLevel, ServiceDependency }) => {
    const nodes = [
      ...businessEntitiesServiceLevels.map(businessEntity => ({
        data: {
          id: businessEntity.id,
          label: BusinessEntity.withId(businessEntity.id).toString(),
          model: 'BusinessEntity'
        },
        position: {
          x: BusinessEntity.withId(businessEntity.id).position.x,
          y: BusinessEntity.withId(businessEntity.id).position.y
        },
        classes: ['BusinessEntity']
      }))
    ]
    const edges = []
    businessEntitiesServiceLevels.forEach(businessEntity => {
      businessEntity.serviceLevels.forEach(serviceLevel => {
        nodes.push({
          data: {
            ...serviceLevel,
            parent: businessEntity.id,
            businessEntityName: BusinessEntity.withId(businessEntity.id).name,
            businessEntityType: BusinessEntity.withId(businessEntity.id).businessEntityType.id,
            model: 'ServiceLevel'
          },
          position: {
            x: ServiceLevel.withId(serviceLevel.id).position.x,
            y: ServiceLevel.withId(serviceLevel.id).position.y
          },
          classes: ['ServiceLevel', BusinessEntity.withId(businessEntity.id).businessEntityType.id]
        })
      })
    })
    serviceDependencies.forEach(serviceDependency => {
      const node = {
        data: {}
      }
      let source, target
      if (serviceDependency.serviceDependencyParent !== undefined) source = serviceDependency.serviceDependencyParent
      else if (serviceDependency.serviceLevelParent !== undefined) source = serviceDependency.serviceLevelParent
      if (serviceDependency.type !== 'serviceLevel') {
        node.data.id = serviceDependency.id
        node.data.type = serviceDependency.type
        node.position = {
          x: ServiceDependency.withId(serviceDependency.id).position.x,
          y: ServiceDependency.withId(serviceDependency.id).position.y
        }
        node.classes = ['ServiceDependency', serviceDependency.type]
        nodes.push(node)
        target = serviceDependency.id
      } else {
        target = serviceDependency.serviceLevel
      }
      edges.push({
        data: {
          id: `${source}-${target}`,
          source,
          target
        },
        classes: []
      })
    })
    return { nodes, edges }
  }
)

export const getHuman = ormSelector(
  schema.selectors.personsType,
  schema.orm,
  (personsType, { Person }) => {
    const nodes = [
      ...personsType.filter(p => Person.withId(p.id).affiliation === 'employee').map(person => ({
      // ...personsType.map(person => ({
        data: {
          id: person.id,
          label: Person.withId(person.id).toString(),
          model: 'Person',
          name: Person.withId(person.id).name,
          type: person.type
        },
        position: {
          x: Person.withId(person.id).position.x,
          y: Person.withId(person.id).position.y
        },
        classes: ['Person', icons.humansTypes.img[person.type] !== undefined ? person.type : 'UnknownHuman']
      }))
    ]
    const edges = []
    personsType.filter(p => Person.withId(p.id).affiliation === 'employee').forEach(person => {
      const source = person.id
      Person.withId(person.id).personsSupervised.forEach(target => {
        edges.push({
          data: {
            id: `${source}-${target}`,
            source,
            target
          },
          classes: []
        })
      })
    })
    return { nodes, edges }
  }
)

export const getAttackGraphMappingFromDependencyGraph = ormSelector(
  (state, serviceLevels, _expandedDevices) => schema.selectors.serviceLevels(state, serviceLevels),
  (_state, _serviceLevels, expandedDevices) => expandedDevices,
  schema.orm,
  (serviceLevels, expandedDevices, { ServiceLevel }) => {
    const targets = []
    serviceLevels.forEach(serviceLevel => {
      ServiceLevel.withId(serviceLevel.id).devicePrivileges.toRefArray().forEach(devicePrivilege => {
        if (expandedDevices.indexOf(devicePrivilege.id) < -1) targets.push(devicePrivilege.id)
        else targets.push(devicePrivilege.device)
      })
    })
    return [...new Set(targets)]
  }
)
