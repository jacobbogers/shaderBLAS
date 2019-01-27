import * as debug from 'debug'
import { createContext, loadImage } from '../tools/tools'

const fs = require('./fs.glsl')
const vs = require('./vs.glsl')
const pic: string = require('../assets/leaves.jpg')

const log = debug('example3')

async function start() {
  const ctx = createContext()
  const jpeg = await loadImage(pic);
  
}

window.addEventListener('load', start)