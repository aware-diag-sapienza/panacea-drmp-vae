'use strict'

const ip = require('ip')

const DEVICE_PRIVILEGES = ['NONE', 'USER', 'ROOT']
const PERSON_PRIVILEGES = ['USE', 'OWN', 'EXECUTE']

const API_MAPPING = {
  deviceInventory: {
    path: 'network/device_inventory',
    filename: 'deviceInventory.json',
    port: 8096,
    relUrl: 'aggregator/deviceInventory'
  },
  networkAttackGraph: {
    path: 'network/graph',
    filename: 'networkLayerAttackGraphRepr.json',
    port: 8096,
    relUrl: 'aggregator/networkLayerAttackGraph'
  },
  reachabilityInventory: {
    path: 'network/reachability_inventory',
    filename: 'reachabilityInventory.json',
    port: 8096,
    relUrl: 'aggregator/reachabilityInventory'
  },
  vulnerabilityCatalog: {
    path: 'network/vulnerability_catalog',
    filename: 'vulnerabilityCatalog.json',
    port: 8096,
    relUrl: 'aggregator/vulnerabilityInventory'
  },
  cyberSecurityProfileInventory: {
    path: 'human/cybersecurity_profile_inventory',
    filename: 'cyberSecurityProfileInventory.json',
    port: 8102,
    relUrl: 'human/cyberSecurityProfileInventory'
  },
  employeeInventory: {
    path: 'human/employee_inventory',
    filename: 'employeeInventory.json',
    port: 8102,
    relUrl: 'human/employeeInventory'
  },
  humanAttackGraph: {
    path: 'human/graph',
    filename: 'humanLayerAttackGraphRepr.json',
    port: 8102,
    relUrl: 'human/humanLayerAttackGraph'
  },
  humanPolicyInventory: {
    path: 'human/policy_inventory',
    filename: 'humanPolicyInventory.json',
    port: 8102,
    relUrl: 'human/humanPolicyInventory'
  },
  humanReachabilityInventory: {
    path: 'human/reachability_inventory',
    filename: 'humanReachabilityInventory.json',
    port: 8102,
    relUrl: 'human/humanReachabilityInventory'
  },
  humanVulnerabilityCatalog: {
    path: 'human/vulnerability_catalog',
    filename: 'humanVulnerabilityCatalog.json',
    port: 8102,
    relUrl: 'human/humanVulnerabilityCatalog'
  },
  humanVulnerabilityInventory: {
    path: 'human/vulnerability_inventory',
    filename: 'humanVulnerabilityInventory.json',
    port: 8102,
    relUrl: 'human/humanVulnerabilityInventory'
  },
  credentialInventory: {
    path: 'inter/credential_inventory',
    filename: 'credentialInventory.json',
    port: 8105,
    relUrl: 'inter-layer/credentialInventory'
  },
  interAttackGraph: {
    path: 'inter/graph',
    filename: 'interLayerAttackGraphRepr.json',
    port: 8105,
    relUrl: 'inter-layer/interLayerAttackGraph'
  },
  businessConfiguration: {
    path: 'business/config',
    filename: 'specification.json',
    port: 8107,
    relUrl: 'business-layer/config'
  },
  businessEntityInventory: {
    path: 'business/entity_inventory',
    filename: 'businessEntityInventory.json',
    port: 8107,
    relUrl: 'business-layer/businessEntityInventory'
  },
  serviceLevelInventory: {
    path: 'business/sl_inventory',
    filename: 'serviceLevelInventory.json',
    port: 8107,
    relUrl: 'business-layer/serviceLevelInventory'
  },
  businessNetworkMapping: {
    path: 'business/network_mapping',
    filename: 'businessNetworkMapping.json',
    port: 8107,
    relUrl: 'business-layer/businessNetworkMapping'
  }
}

const loadNetwork = (vulnerabilityCatalog, deviceInventory, reachabilityInventory, networkAttackGraph, layout) => {
  return new Promise((resolve, reject) => {
    try {
      const network = {
        networkVulnerabilities: [],
        devices: [],
        localServices: [],
        subnets: [],
        ifaces: [],
        networkServices: [],
        networkRoutes: [],
        devicePrivileges: [],
        networkSteps: [],
        networkExploits: []
      }
      vulnerabilityCatalog.vulnerabilities.forEach(vulnerabilityEntry => {
        const networkVulnerability = {
          id: vulnerabilityEntry.cveId,
          name: vulnerabilityEntry.cveId,
          description: vulnerabilityEntry.description,
          cwe: vulnerabilityEntry.cwe.map(c => ({ id: c.cweId, name: c.cweName })),
          references: vulnerabilityEntry.reference,
          impactV2: vulnerabilityEntry.impactV2,
          impactV3: vulnerabilityEntry.impactV3,
          preCondition: vulnerabilityEntry.preCondition,
          postCondition: vulnerabilityEntry.postCondition
        }
        network.networkVulnerabilities.push(networkVulnerability)
      })
      deviceInventory.devices.forEach(deviceEntry => {
        const device = {
          id: deviceEntry.id,
          // TODO: fix missing names
          name: deviceEntry.id !== '63841b50abde7be7f36b38e66695e322dcbc90c9'
            ? deviceEntry.hostName !== null
              ? deviceEntry.hostName
              : deviceEntry.id.substring(0, 6)
            : 'POCT1',
          // TODO: fix missing types
          type: ['63841b50abde7be7f36b38e66695e322dcbc90c9', '12b5d1af19957351a3a7da2294735440bfc34828'].indexOf(deviceEntry.id) < 0 ? deviceEntry.type.replace(/\s/g, '') : 'MedicalDevice',
          operatingSystem: {
            family: deviceEntry.operatingSystem.family,
            generation: deviceEntry.operatingSystem.generation,
            vendor: deviceEntry.operatingSystem.vendor
          },
          position: {
            x: layout[deviceEntry.id] ? layout[deviceEntry.id].x : null,
            y: layout[deviceEntry.id] ? layout[deviceEntry.id].y : null
          },
          networkVulnerabilities: deviceEntry.operatingSystem.osVulnerabilities
        }
        network.devices.push(device)
        deviceEntry.operatingSystem.localServices.forEach(localServiceEntry => {
          const localService = {
            id: `${device.id}:${localServiceEntry.description}`,
            name: localServiceEntry.description,
            cpe: localServiceEntry.cpe,
            version: localServiceEntry.version,
            device: device.id,
            networkVulnerabilities: localServiceEntry.vulnerabilities
          }
          network.localServices.push(localService)
        })
        deviceEntry.networkInterfaces.forEach(ifaceEntry => {
          const subnetEntry = ip.subnet(ifaceEntry.ipAddress, ifaceEntry.mask)
          const subnetId = `${subnetEntry.networkAddress}/${subnetEntry.subnetMaskLength}`
          if (network.subnets.map(s => s.id).indexOf(subnetId) < 0) {
            const subnet = {
              id: subnetId,
              name: subnetId,
              address: subnetEntry.networkAddress,
              mask: subnetEntry.subnetMask,
              maskLength: subnetEntry.subnetMaskLength,
              maxNumHosts: subnetEntry.numHosts,
              position: {
                x: layout[subnetId] ? layout[subnetId].x : null,
                y: layout[subnetId] ? layout[subnetId].y : null
              }
            }
            network.subnets.push(subnet)
          }
          const iface = {
            id: `${device.id}:${ifaceEntry.name}`,
            name: ifaceEntry.name,
            mac: ifaceEntry.macAddress,
            ip: {
              version: ifaceEntry.version,
              address: ifaceEntry.ipAddress
            },
            device: device.id,
            subnet: subnetId
          }
          network.ifaces.push(iface)
          ifaceEntry.ports.forEach(portEntry => {
            if (portEntry.service !== null) {
              const networkService = {
                id: `${iface.id}:${portEntry.number}:${portEntry.transportProtocol.toUpperCase()}`,
                name: portEntry.service.description,
                cpe: portEntry.service.cpe,
                version: portEntry.service.version,
                state: portEntry.service.runningState,
                port: {
                  number: portEntry.number,
                  transport: portEntry.transportProtocol.toUpperCase(),
                  state: portEntry.state
                },
                iface: iface.id,
                networkVulnerabilities: portEntry.service.vulnerabilities
              }
              network.networkServices.push(networkService)
            }
          })
        })
      })
      reachabilityInventory.sourceDevices.forEach(deviceSourceEntry => {
        deviceSourceEntry.reachedInterface.forEach(ifaceSourceEntry => {
          const sourceId = `${deviceSourceEntry.id}:${ifaceSourceEntry.name}`
          ifaceSourceEntry.reachedDevices.forEach(deviceTargetEntry => {
            // const deviceTargetId = network.devices[network.devices.map(d => d.name).indexOf(deviceTargetEntry.hostName)].id
            const deviceTargetId = deviceTargetEntry.deviceId
            const targetId = `${deviceTargetId}:${deviceTargetEntry.ifaceName}`
            if (deviceSourceEntry.id !== deviceTargetId) {
              const networkRoute = {
                id: `${sourceId}-${targetId}`,
                ifaceSource: sourceId,
                ifaceTarget: targetId,
                networkServicesTarget: deviceTargetEntry.reachedPorts.filter(portEntry => portEntry.service.length > 0).map(portEntry => `${targetId}:${portEntry.port}:${portEntry.protocol}`)
              }
              network.networkRoutes.push(networkRoute)
            }
          })
        })
      })
      /*
      networkAttackGraph.nodes.forEach(devicePrivilegeEntry => {
        const deviceId = network.devices[network.devices.map(d => d.name).indexOf(devicePrivilegeEntry.deviceHostname)].id
        const devicePrivilege = {
          id: devicePrivilegeEntry.uuid,
          name: devicePrivilegeEntry.uuid,
          level: devicePrivilegeEntry.privLevel,
          device: deviceId
        }
        network.devicePrivileges.push(devicePrivilege)
      })
      */
      network.devices.forEach(device => {
        DEVICE_PRIVILEGES.forEach(privLevel => {
          const devicePrivilege = {
            id: `${privLevel}@${device.id}`,
            name: `${privLevel}@${device.name}`,
            level: privLevel,
            device: device.id
          }
          network.devicePrivileges.push(devicePrivilege)
        })
      })
      networkAttackGraph.edges.forEach(networkStepEntry => {
        const networkStepId = `${networkStepEntry.source}-${networkStepEntry.destination}`
        const deviceSourceId = network.devicePrivileges.filter(dp => dp.id === networkStepEntry.source)[0].device
        const deviceTargetId = network.devicePrivileges.filter(dp => dp.id === networkStepEntry.destination)[0].device
        const networkStep = {
          id: networkStepId,
          devicePrivilegeSource: networkStepEntry.source,
          devicePrivilegeTarget: networkStepEntry.destination
        }
        network.networkSteps.push(networkStep)
        networkStepEntry.vulnerabilities.forEach(networkExploitEntry => {
          const networkExploit = {
            id: `${networkStepId}:${networkExploitEntry.CVE}`,
            type: networkExploitEntry.type,
            networkStep: networkStepId,
            networkVulnerability: networkExploitEntry.CVE,
            ifaceSource: `${deviceSourceId}:${networkExploitEntry.fromInt}`,
            ifaceTarget: `${deviceTargetId}:${networkExploitEntry.toInt}`
          }
          if (networkExploitEntry.port) networkExploit.targetService = `${deviceTargetId}:${networkExploitEntry.toInt}:${networkExploitEntry.port}`
          network.networkExploits.push(networkExploit)
        })
      })
      resolve(network)
    } catch (err) {
      reject(err)
    }
  })
}

const loadHuman = (humanVulnerabilityCatalog, employeeInventory, humanVulnerabilityInventory, humanReachabilityInventory, cyberSecurityProfileInventory, humanPolicyInventory, humanAttackGraph, layout) => {
  return new Promise((resolve, reject) => {
    try {
      const human = {
        humanVulnerabilities: [],
        roles: [],
        locations: [],
        persons: [],
        personPrivileges: [],
        humanSteps: [],
        humanExploits: []
      }
      humanVulnerabilityCatalog.humanVulnerabilities.forEach(humanVulnerabilityEntry => {
        const humanVulnerability = {
          id: humanVulnerabilityEntry.id,
          name: humanVulnerabilityEntry.name,
          description: humanVulnerabilityEntry.description,
          impact: {
            accessVector: humanVulnerabilityEntry.accessVector,
            attackComplexity: humanVulnerabilityEntry.attackComplexity,
            identityImpact: humanVulnerabilityEntry.identityImpact
          },
          preCondition: humanVulnerabilityEntry.preCondition,
          postCondition: humanVulnerabilityEntry.postCondition
        }
        human.humanVulnerabilities.push(humanVulnerability)
      })
      employeeInventory.employees.forEach(employeeEntry => {
        const person = {
          id: employeeEntry.id,
          name: employeeEntry.employeeName,
          affiliation: 'employee',
          position: {
            x: layout[employeeEntry.id] ? layout[employeeEntry.id].x : null,
            y: layout[employeeEntry.id] ? layout[employeeEntry.id].y : null
          },
          locations: employeeEntry.locations.map(locationEntry => locationEntry.id),
          humanVulnerabilities: humanVulnerabilityInventory.humanVulnerabilitiesMapping.filter(mapping => mapping.employeeId === employeeEntry.id)[0].vulnerabilityIdList,
          personsSupervised: humanPolicyInventory.humanPolicies.filter(p => p.sourceId === employeeEntry.id && p.relationType === 'supervise').map(p => p.targetId)
        }
        human.persons.push(person)
        employeeEntry.roles.forEach(roleEntry => {
          if (human.roles.map(role => role.id).indexOf(roleEntry.id) < 0) {
            const role = {
              id: roleEntry.id,
              // position: roleEntry.position.replace(/\s/g, ''),
              position: roleEntry.position,
              department: roleEntry.department,
              timeStart: roleEntry.from,
              timeEnd: roleEntry.to,
              person: person.id
            }
            human.roles.push(role)
          }
        })
        employeeEntry.locations.forEach(locationEntry => {
          if (human.locations.map(location => location.id).indexOf(locationEntry.id) < 0) {
            const location = {
              id: locationEntry.id,
              building: locationEntry.building,
              floor: locationEntry.floor,
              corridor: locationEntry.corridor,
              room: locationEntry.room
            }
            human.locations.push(location)
          }
        })
      })
      // TODO: Ask data for persons that are not employees
      const person = {
        id: 'INTERNAL_ATTACKER',
        name: 'Internal Attacker',
        affiliation: '',
        position: {
          x: layout.INTERNAL_ATTACKER ? layout.INTERNAL_ATTACKER.x : null,
          y: layout.INTERNAL_ATTACKER ? layout.INTERNAL_ATTACKER.y : null
        },
        locations: [],
        vulnerabilities: []
      }
      const role = {
        id: 'roleAtt',
        position: 'Attacker',
        department: '',
        timeStart: '01/11/2019',
        timeEnd: 'present',
        person: person.id
      }
      human.persons.push(person)
      human.roles.push(role)
      /*
      humanAttackGraph.nodes.forEach(personPrivilegeEntry => {
        const personPrivilege = {
          id: personPrivilegeEntry.uuid,
          name: personPrivilegeEntry.name,
          level: personPrivilegeEntry.privLevel,
          person: personPrivilegeEntry.employeeId
        }
        human.personPrivileges.push(personPrivilege)
      })
      */
      human.persons.forEach(person => {
        PERSON_PRIVILEGES.forEach(privLevel => {
          const personPrivilege = {
            id: `${privLevel}@${person.id}`,
            name: `${privLevel}@${person.id}`,
            level: privLevel,
            person: person.id
          }
          human.personPrivileges.push(personPrivilege)
        })
      })
      humanAttackGraph.edges.forEach(humanStepEntry => {
        const humanStepId = `${humanStepEntry.source}-${humanStepEntry.destination}`
        const humanStep = {
          id: humanStepId,
          personPrivilegeSource: humanStepEntry.source,
          personPrivilegeTarget: humanStepEntry.destination
        }
        human.humanSteps.push(humanStep)
        humanStepEntry.vulnerabilities.forEach(humanExploitEntry => {
          const humanExploit = {
            id: `${humanStepId}:${humanExploitEntry.vulnId}`,
            type: humanExploitEntry.exploitationType,
            humanStep: humanStepId,
            humanVulnerability: humanExploitEntry.vulnId
          }
          human.humanExploits.push(humanExploit)
        })
      })
      resolve(human)
    } catch (err) {
      reject(err)
    }
  })
}

const loadInter = (credentialInventory, interAttackGraph) => {
  return new Promise((resolve, reject) => {
    try {
      const inter = {
        credentials: [],
        interSteps: []
      }
      credentialInventory.credentials.forEach(credentialEntry => {
        const credential = {
          id: credentialEntry.id,
          type: credentialEntry.privilegeType,
          person: credentialEntry.employeeId,
          devicePrivileges: []
        }
        credentialEntry.destination.forEach(devicePrivilegeEntry => {
          const devicePrivilege = `${devicePrivilegeEntry.privilegeLevel}@${devicePrivilegeEntry.deviceId}`
          if (credential.devicePrivileges.indexOf(devicePrivilege) < 0) credential.devicePrivileges.push(devicePrivilege)
        })
        inter.credentials.push(credential)
      })
      const credentialsSteps = {}
      interAttackGraph.nodes.forEach(credentialNode => {
        credentialsSteps[credentialNode.uuid] = {
          credential: credentialNode.uuid,
          personPrivilegeSources: [],
          devicePrivilegeTargets: []
        }
      })
      interAttackGraph.humanAccessEdges.forEach(humanStep => credentialsSteps[humanStep.destination].personPrivilegeSources.push(humanStep.source))
      interAttackGraph.accessNetworkEdges.forEach(networkStep => credentialsSteps[networkStep.source].devicePrivilegeTargets.push(networkStep.destination))
      Object.entries(credentialsSteps).forEach(([credentialId, credentialStep]) => {
        credentialStep.personPrivilegeSources.forEach(personPrivilegeSource => {
          credentialStep.devicePrivilegeTargets.forEach(devicePrivilegeTarget => {
            inter.interSteps.push({
              id: `${personPrivilegeSource}-${credentialId}-${devicePrivilegeTarget}`,
              credential: credentialId,
              personPrivilegeSource,
              devicePrivilegeTarget
            })
          })
        })
      })
      resolve(inter)
    } catch (err) {
      reject(err)
    }
  })
}

const loadBusiness = (businessConfiguration, businessEntityInventory, serviceLevelInventory, dependencyLayout) => {
  return new Promise((resolve, reject) => {
    try {
      const business = {
        businessEntityTypes: [{ id: 'BUSINESS' }, { id: 'SERVICE' }, { id: 'ASSET' }],
        businessEntities: businessEntityInventory.businessEntities.map(businessEntityEntry => ({
          id: businessEntityEntry.id,
          name: businessEntityEntry.name,
          businessEntityType: businessEntityEntry.type,
          position: {
            x: dependencyLayout[businessEntityEntry.id] ? dependencyLayout[businessEntityEntry.id].x : null,
            y: dependencyLayout[businessEntityEntry.id] ? dependencyLayout[businessEntityEntry.id].y : null
          }
        })),
        serviceLevels: [],
        serviceDependencies: []
      }
      const serviceLevelsToBusinessEntities = {}
      businessEntityInventory.businessEntities.forEach(businessEntityEntry => {
        businessEntityEntry.serviceLevelsList.forEach(serviceLevelId => {
          serviceLevelsToBusinessEntities[serviceLevelId] = businessEntityEntry.id
        })
      })
      let serviceDependencyIndex
      const extractDependencies = (dependencyNode, parentNode, rootServiceLevel) => {
        const id = `${rootServiceLevel}-${serviceDependencyIndex}`
        const node = {
          id: id,
          position: {
            x: dependencyLayout[id] ? dependencyLayout[id].x : null,
            y: dependencyLayout[id] ? dependencyLayout[id].y : null
          }
        }
        serviceDependencyIndex += 1
        if (dependencyNode.dependencyType === 'ServiceLevelDependencyNode') {
          node.type = 'serviceLevel'
          node.serviceLevel = dependencyNode.serviceLevelId
        } else if (dependencyNode.dependencyType === 'AllDependencyNode') {
          node.type = 'AND'
          dependencyNode.dependencies.forEach(dn => extractDependencies(dn, { id: node.id, type: 'serviceDependency' }, rootServiceLevel))
        } else if (dependencyNode.dependencyType === 'AnyDependencyNode') {
          node.type = 'OR'
          dependencyNode.dependencies.forEach(dn => extractDependencies(dn, { id: node.id, type: 'serviceDependency' }, rootServiceLevel))
        }
        if (parentNode.type === 'serviceLevel') node.serviceLevelParent = parentNode.id
        else if (parentNode.type === 'serviceDependency') node.serviceDependencyParent = parentNode.id
        business.serviceDependencies.push(node)
      }
      serviceLevelInventory.serviceLevels.forEach(serviceLevelEntry => {
        business.serviceLevels.push({
          id: serviceLevelEntry.id,
          confidentialityLevel: serviceLevelEntry.confidentialityLevel,
          integrityLevel: serviceLevelEntry.integrityLevel,
          availabilityLevel: serviceLevelEntry.availabilityLevel,
          impact: serviceLevelEntry.impact,
          businessEntity: serviceLevelsToBusinessEntities[serviceLevelEntry.id],
          position: {
            x: dependencyLayout[serviceLevelEntry.id] ? dependencyLayout[serviceLevelEntry.id].x : null,
            y: dependencyLayout[serviceLevelEntry.id] ? dependencyLayout[serviceLevelEntry.id].y : null
          }
        })
        serviceDependencyIndex = 0
        if (serviceLevelEntry.dependency !== null) extractDependencies(serviceLevelEntry.dependency, { id: serviceLevelEntry.id, type: 'serviceLevel' }, serviceLevelEntry.id)
      })
      resolve(business)
    } catch (err) {
      reject(err)
    }
  })
}

const loadBusinessMapping = (businessNetworkMapping) => {
  return new Promise((resolve, reject) => {
    try {
      const businessMapping = {
        devicePrivileges: businessNetworkMapping.mappings.map(mappingEntry => ({
          devicePrivilegeId: mappingEntry.deviceId,
          serviceLevel: mappingEntry.serviceLevelId
        }))
      }
      resolve(businessMapping)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  API_MAPPING,
  loadNetwork,
  loadHuman,
  loadInter,
  loadBusiness,
  loadBusinessMapping
}
