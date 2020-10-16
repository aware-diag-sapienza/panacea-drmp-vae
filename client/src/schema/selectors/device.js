import { createSelector as ormSelector } from 'redux-orm'
import { createSelector } from 'reselect'

import orm from '../orm'

export const devices = ormSelector(orm.Device)

export const devicesIfaces = ormSelector(
  devices,
  orm.Device.ifaces,
  (_, idArg) => idArg,
  (devices, ifaces, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return devices.map((dev, idx) => ({
        id: dev.id,
        ifaces: ifaces[idx]
      }))
    } else {
      return {
        id: devices.id,
        ifaces: ifaces
      }
    }
  }
)
export const devicesDevicePrivileges = ormSelector(
  devices,
  orm.Device.devicePrivileges,
  (_, idArg) => idArg,
  (devices, devicePrivileges, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return devices.map((dev, idx) => ({
        id: dev.id,
        devicePrivileges: devicePrivileges[idx]
      }))
    } else {
      return {
        id: devices.id,
        devicePrivileges: devicePrivileges
      }
    }
  }
)
export const devicesLocalServices = ormSelector(
  devices,
  orm.Device.localServices,
  (_, idArg) => idArg,
  (devices, localServices, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return devices.map((dev, idx) => ({
        id: dev.id,
        localServices: localServices[idx]
      }))
    } else {
      return {
        id: devices.id,
        localServices: localServices
      }
    }
  }
)
export const devicesNetworkServices = ormSelector(
  devices,
  orm.Device.ifaces.map(orm.Iface.networkServices),
  (_, idArg) => idArg,
  (devices, networkServices, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return devices.map((dev, idx) => ({
        id: dev.id,
        networkServices: networkServices[idx].flat()
      }))
    } else {
      return {
        id: devices.id,
        networkServices: networkServices.flat()
      }
    }
  }
)

// Vulnerabilities
export const devicesOsVulnerabilities = ormSelector(
  devices,
  orm.Device.networkVulnerabilities,
  (_, idArg) => idArg,
  (devices, osVulnerabilities, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      const devicesVulnerabilities = {}
      devices.forEach((dev, idx) => {
        const devVulnerabilities = {
          device: dev,
          osVulnerabilities: Array.from(new Set(osVulnerabilities[idx]))
        }
        devicesVulnerabilities[dev.id] = devVulnerabilities
      })
      return devicesVulnerabilities
    } else {
      const devVulnerabilities = {
        device: devices,
        osVulnerabilities: Array.from(new Set(osVulnerabilities))
      }
      return devVulnerabilities
    }
  }
)
export const devicesLocalVulnerabilities = ormSelector(
  devices,
  devicesLocalServices,
  orm,
  (_, idArg) => idArg,
  (devices, devicesLocalServices, { LocalService }, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      const devicesVulnerabilities = {}
      devices.forEach((dev, idx) => {
        const devVulnerabilities = {
          device: dev,
          localVulnerabilities: []
        }
        devicesLocalServices[idx].localServices.map(ls => ls.id).forEach(localServiceId => devVulnerabilities.localVulnerabilities.push(...LocalService.withId(localServiceId).networkVulnerabilities.toRefArray()))
        devVulnerabilities.localVulnerabilities = Array.from(new Set(devVulnerabilities.localVulnerabilities))
        devicesVulnerabilities[dev.id] = devVulnerabilities
      })
      return devicesVulnerabilities
    } else {
      const devVulnerabilities = {
        device: devices,
        localVulnerabilities: []
      }
      devicesLocalServices.localServices.map(ls => ls.id).forEach(localServiceId => devVulnerabilities.localVulnerabilities.push(...LocalService.withId(localServiceId).networkVulnerabilities.toRefArray()))
      devVulnerabilities.localVulnerabilities = Array.from(new Set(devVulnerabilities.localVulnerabilities))
      return devVulnerabilities
    }
  }
)
export const devicesNetworkVulnerabilities = ormSelector(
  devices,
  devicesNetworkServices,
  orm,
  (_, idArg) => idArg,
  (devices, devicesNetworkServices, { NetworkService }, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      const devicesVulnerabilities = {}
      devices.forEach((dev, idx) => {
        const devVulnerabilities = {
          device: dev,
          networkVulnerabilities: []
        }
        devicesNetworkServices[idx].networkServices.map(ls => ls.id).forEach(networkServiceId => devVulnerabilities.networkVulnerabilities.push(...NetworkService.withId(networkServiceId).networkVulnerabilities.toRefArray()))
        devVulnerabilities.networkVulnerabilities = Array.from(new Set(devVulnerabilities.networkVulnerabilities))
        devicesVulnerabilities[dev.id] = devVulnerabilities
      })
      return devicesVulnerabilities
    } else {
      const devVulnerabilities = {
        device: devices,
        networkVulnerabilities: []
      }
      devicesNetworkServices.networkServices.map(ls => ls.id).forEach(networkServiceId => devVulnerabilities.networkVulnerabilities.push(...NetworkService.withId(networkServiceId).networkVulnerabilities.toRefArray()))
      devVulnerabilities.networkVulnerabilities = Array.from(new Set(devVulnerabilities.networkVulnerabilities))
      return devVulnerabilities
    }
  }
)
export const devicesVulnerabilities = createSelector(
  devicesOsVulnerabilities,
  devicesLocalVulnerabilities,
  devicesNetworkVulnerabilities,
  (_, idArg) => idArg,
  (devicesOsVulnerabilities, devicesLocalVulnerabilities, devicesNetworkVulnerabilities, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      const devicesVulnerabilities = {}
      Object.entries(devicesOsVulnerabilities).forEach(([k, v]) => {
        const devVulnerabilities = {
          device: v.device,
          osVulnerabilities: v.osVulnerabilities,
          localVulnerabilities: devicesLocalVulnerabilities[k].localVulnerabilities,
          networkVulnerabilities: devicesNetworkVulnerabilities[k].networkVulnerabilities
        }
        devicesVulnerabilities[v.device.id] = devVulnerabilities
      })
      return devicesVulnerabilities
    } else {
      return {
        device: devicesOsVulnerabilities.device,
        osVulnerabilities: devicesOsVulnerabilities.osVulnerabilities,
        localVulnerabilities: devicesLocalVulnerabilities.localVulnerabilities,
        networkVulnerabilities: devicesNetworkVulnerabilities.networkVulnerabilities
      }
    }
  }
)

// Network routes
export const devicesNetworkRoutesOutgoing = ormSelector(
  devices,
  orm.Device.ifaces.map(orm.Iface.networkRoutesOutgoing),
  (_, idArg) => idArg,
  (devices, networkRoutesOutgoing, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return devices.map((dev, idx) => ({
        id: dev.id,
        networkRoutesOutgoing: networkRoutesOutgoing[idx].flat()
      }))
    } else {
      return {
        id: devices.id,
        networkRoutesOutgoing: networkRoutesOutgoing.flat()
      }
    }
  }
)
export const devicesNetworkRoutesIncoming = ormSelector(
  devices,
  orm.Device.ifaces.map(orm.Iface.networkRoutesIncoming),
  (_, idArg) => idArg,
  (devices, networkRoutesIncoming, idArg) => {
    if (typeof idArg === 'undefined' || Array.isArray(idArg)) {
      return devices.map((dev, idx) => ({
        id: dev.id,
        networkRoutesIncoming: networkRoutesIncoming[idx].flat()
      }))
    } else {
      return {
        id: devices.id,
        networkRoutesIncoming: networkRoutesIncoming.flat()
      }
    }
  }
)

// Reachability
export const deviceNetTargetDevices = ormSelector(
  (_, deviceId) => deviceId,
  orm,
  (deviceId, { Device }) => {
    const results = []
    if (!Device.idExists(deviceId)) return results
    Device.withId(deviceId).ifaces.toModelArray().forEach(ifaceSource => {
      ifaceSource.networkRoutesOutgoing.toModelArray().forEach(networkRoute => {
        networkRoute.networkServicesTarget.toRefArray().forEach(networkServiceTarget => {
          results.push({
            deviceSource: Device.withId(deviceId).ref,
            deviceTarget: networkRoute.ifaceTarget.device.ref,
            networkService: networkServiceTarget
          })
        })
      })
    })
    return results
  }
)
export const deviceNetSourceDevices = ormSelector(
  (_, deviceId) => deviceId,
  orm,
  (deviceId, { Device }) => {
    const results = []
    if (!Device.idExists(deviceId)) return results
    Device.withId(deviceId).ifaces.toModelArray().forEach(ifaceTarget => {
      ifaceTarget.networkRoutesIncoming.toModelArray().forEach(networkRoute => {
        networkRoute.networkServicesTarget.toRefArray().forEach(networkServiceTarget => {
          results.push({
            deviceSource: networkRoute.ifaceSource.device.ref,
            deviceTarget: Device.withId(deviceId).ref,
            networkService: networkServiceTarget
          })
        })
      })
    })
    return results
  }
)
export const deviceNetSourcePersons = ormSelector(
  (state, deviceId) => deviceNetSourceDevices(state, deviceId),
  orm,
  (deviceNetSourceDevices, { Device }) => {
    const results = []
    deviceNetSourceDevices.forEach(s => {
      Device.withId(s.deviceSource.id).devicePrivileges.toModelArray().forEach(devicePrivilege => {
        devicePrivilege.credentials.toModelArray().forEach(credential => {
          results.push({
            personSource: credential.person.ref,
            deviceTarget: s.deviceTarget,
            networkService: s.networkService
          })
        })
      })
    })
    return results
  }
)

// Attack graph reachability
export const deviceAttTargetDevices = ormSelector(
  (_, deviceId) => deviceId,
  orm,
  (deviceId, { Device }) => {
    const results = []
    if (!Device.idExists(deviceId)) return results
    Device.withId(deviceId).devicePrivileges.toModelArray().forEach(devicePrivilegeSource => {
      devicePrivilegeSource.networkStepsOutgoing.toModelArray().forEach(networkStep => {
        results.push({
          deviceSource: Device.withId(deviceId).ref,
          deviceTarget: networkStep.devicePrivilegeTarget.device.ref,
          networkStep: networkStep.ref
        })
      })
    })
    return results
  }
)
export const deviceAttSourceDevices = ormSelector(
  (_, deviceId) => deviceId,
  orm,
  (deviceId, { Device }) => {
    const results = []
    if (!Device.idExists(deviceId)) return results
    Device.withId(deviceId).devicePrivileges.toModelArray().forEach(devicePrivilegeTarget => {
      devicePrivilegeTarget.networkStepsIncoming.toModelArray().forEach(networkStep => {
        results.push({
          deviceSource: networkStep.devicePrivilegeSource.device.ref,
          deviceTarget: Device.withId(deviceId).ref,
          networkStep: networkStep.ref
        })
      })
    })
    return results
  }
)
export const deviceAttSourcePersons = ormSelector(
  (state, deviceId) => deviceAttSourceDevices(state, deviceId),
  orm,
  (deviceAttSourceDevices, { Device }) => {
    const results = []
    return results
  }
)
