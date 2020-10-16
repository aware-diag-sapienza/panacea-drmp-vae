import axios from 'axios'

import laptop from '@mdi/svg/svg/laptop.svg'
import server from '@mdi/svg/svg/server.svg'
import router from '@mdi/svg/svg/router.svg'
import wall from '@mdi/svg/svg/wall.svg'
import hospitalBox from '@mdi/svg/svg/hospital-box.svg'
import lan from '@mdi/svg/svg/lan.svg'
import helpCircleOutline from '@mdi/svg/svg/help-circle-outline.svg'

import doctor from '@mdi/svg/svg/doctor.svg'
import accountTie from '@mdi/svg/svg/account-tie.svg'
import accountCog from '@mdi/svg/svg/account-cog.svg'
import incognito from '@mdi/svg/svg/incognito.svg'
import accountQuestion from '@mdi/svg/svg/account-question.svg'

import hospital from '@mdi/svg/svg/hospital.svg'
import stateMachine from '@mdi/svg/svg/state-machine.svg'
import desktopClassic from '@mdi/svg/svg/desktop-classic.svg'

const file2Element = async svgFile => {
  const parser = new DOMParser()
  const svgString = await axios.get(svgFile, 'text')
  return parser.parseFromString(svgString.data, 'text/xml').documentElement
}

const element2Str = element => 'data:image/svg+xml;utf8,' + encodeURIComponent(element.outerHTML)

const loadInlineSvg = (element, style) => {
  for (const prop in style) element.style[prop] = style[prop]
  return element2Str(element)
}

const devicesTypes = {
  img: {
    Workstation: laptop,
    Server: server,
    Switch: router,
    Firewall: wall,
    MedicalDevice: hospitalBox,
    Subnet: lan,
    UnknownNetwork: helpCircleOutline
  },
  inline: {}
}
for (const key in devicesTypes.img) file2Element(devicesTypes.img[key]).then(el => { devicesTypes.inline[key] = el })

const humansTypes = {
  img: {
    Doctor: doctor,
    Director: accountTie,
    SystemAdministrator: accountCog,
    Attacker: incognito,
    UnknownHuman: accountQuestion
  },
  inline: {}
}
for (const key in humansTypes.img) file2Element(humansTypes.img[key]).then(el => { humansTypes.inline[key] = el })

const businessEntitiesTypes = {
  img: {
    BUSINESS: hospital,
    SERVICE: stateMachine,
    ASSET: desktopClassic
  },
  inline: {}
}
for (const key in businessEntitiesTypes.img) file2Element(businessEntitiesTypes.img[key]).then(el => { businessEntitiesTypes.inline[key] = el })

export default {
  devicesTypes,
  humansTypes,
  businessEntitiesTypes,
  loadInlineSvg
}
