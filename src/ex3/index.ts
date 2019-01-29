import * as debug from 'debug'
import { createGLContext, loadImage } from '../tools/tools'

const fs: string = require('./fs.glsl')
const vs: string = require('./vs.glsl')
const pic: string = require('../assets/leaves.jpg')

const log = debug('example3')

async function start() {

  const jpeg = await loadImage(pic);

  const [ctx, err] = createGLContext()
  if (err) {
    log(`%c ${err}`, 'color:red')
    return
  }

}

window.addEventListener('load', start)