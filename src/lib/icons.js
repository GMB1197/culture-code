import {
  faHouse, faGamepad, faFire, faLocationDot, faUser, faBrain, faKey, faShieldHalved, faGlobe, faEye,
  faLandmark, faMapLocationDot, faMicrochip, faBookOpen, faWandMagicSparkles, faCalendarCheck, faCalendarDay,
  faBolt, faUnlockKeyhole, faFont, faGears, faTableCells, faLaptopCode, faGraduationCap, faMasksTheater,
  faTrainSubway, faMonument, faWater, faMoon, faChevronDown, faChevronLeft, faChevronRight, faBan,
  faMobileScreen, faTrophy, faBullseye, faHeadphones, faCamera, faStop, faCheck, faLock, faLightbulb,
  faArrowLeft, faArrowRight, faWifi, faCloud, faStopwatch, faQrcode, faShareNodes, faDatabase, faStar,
  faGlobe as faEarth, faPlay, faRotateRight, faHandHoldingHeart, faBookOpenReader, faInfinity
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { icon as faRender } from '@fortawesome/fontawesome-svg-core'

export const AMBER = '#f2b45a'

export const I = {
  home: faHouse, gamepad: faGamepad, fire: faFire, pin: faLocationDot, user: faUser, brain: faBrain,
  key: faKey, shield: faShieldHalved, globe: faGlobe, eye: faEye, landmark: faLandmark, map: faMapLocationDot,
  chip: faMicrochip, bookOpen: faBookOpen, wand: faWandMagicSparkles, calendarCheck: faCalendarCheck,
  calendarDay: faCalendarDay, bolt: faBolt, unlock: faUnlockKeyhole, font: faFont, gears: faGears,
  tableCells: faTableCells, laptopCode: faLaptopCode, graduationCap: faGraduationCap, masksTheater: faMasksTheater,
  trainSubway: faTrainSubway, monument: faMonument, water: faWater, moon: faMoon, chevronDown: faChevronDown,
  chevronLeft: faChevronLeft, chevronRight: faChevronRight, ban: faBan, mobile: faMobileScreen, trophy: faTrophy,
  bullseye: faBullseye, headphones: faHeadphones, camera: faCamera, stop: faStop, check: faCheck, lock: faLock,
  lightbulb: faLightbulb, arrowLeft: faArrowLeft, arrowRight: faArrowRight, wifi: faWifi, cloud: faCloud,
  stopwatch: faStopwatch, qrcode: faQrcode, share: faShareNodes, database: faDatabase, star: faStar,
  earth: faEarth, play: faPlay, rotate: faRotateRight, heart: faHandHoldingHeart, reader: faBookOpenReader,
  infinity: faInfinity, instagram: faInstagram, youtube: faYoutube
}

// SVG come stringa (per la mappa Leaflet, che non usa Vue)
export function iconSvg(def) {
  return faRender(def).html[0]
}
