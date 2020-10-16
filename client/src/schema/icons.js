import Workstation from '@mdi/svg/svg/laptop.svg'
import Server from '@mdi/svg/svg/server.svg'
import Switch from '@mdi/svg/svg/router.svg'
import Firewall from '@mdi/svg/svg/wall.svg'
import MedicalDevice from '@mdi/svg/svg/hospital-box.svg'
import Subnet from '@mdi/svg/svg/lan.svg'
import UnknownNetwork from '@mdi/svg/svg/help-circle-outline.svg'

import Doctor from '@mdi/svg/svg/doctor.svg'
import Director from '@mdi/svg/svg/account-tie.svg'
import SystemAdministrator from '@mdi/svg/svg/account-cog.svg'
import Attacker from '@mdi/svg/svg/incognito.svg'
import UnknownHuman from '@mdi/svg/svg/account-question.svg'

import BUSINESS from '@mdi/svg/svg/hospital.svg'
import SERVICE from '@mdi/svg/svg/state-machine.svg'
import ASSET from '@mdi/svg/svg/desktop-classic.svg'
import axios from 'axios'

const file2Element = async svgFile => {
  const parser = new DOMParser()
  const svgString = await axios.get(svgFile, 'text')
  return parser.parseFromString(svgString.data, 'text/xml').documentElement
}

const element2Str = element => 'data:image/svg+xml;utf8,' + encodeURIComponent(element.outerHTML)

const loadSvg = (element, style) => {
  for (const prop in style) element.style[prop] = style[prop]
  return element2Str(element)
}

const network = {
  Workstation,
  Server,
  Switch,
  Firewall,
  MedicalDevice,
  Subnet,
  UnknownNetwork
}

const human = {
  Doctor,
  Director,
  SystemAdministrator,
  Attacker,
  UnknownHuman
}

const business = {
  BUSINESS,
  SERVICE,
  ASSET
}

const businessStyled = {}
file2Element(BUSINESS).then(r => { businessStyled.BUSINESS = r })
file2Element(SERVICE).then(r => { businessStyled.SERVICE = r })
file2Element(ASSET).then(r => { businessStyled.ASSET = r })

export { network, human, business, businessStyled, loadSvg }
