import * as debug from 'debug'
import { createProgramContext, createGLContext, loadImage } from '../tools/tools'

const fs: string = require('./fs.glsl')
const vs: string = require('./vs.glsl')
const pic: string = require('../assets/leaves.jpg')

const log = debug('example3')

async function start() {

  const jpeg = await loadImage(pic);
  let pgCtx, ctx, err
  [ctx, err] = createGLContext()
  if (err) {
    log(`%c ${err}`, 'color:red')
    return
  }

  [pgCtx, err]  = createProgramContext(ctx, vs, fs)
  pgCtx.registerUniforms(['u_resolution','u_image','u_kernel[0]','u_kernelWeight','u_flipY'])
  pgCtx.registerAttributes(['a_position','a_texCoord'])

}

window.addEventListener('load', start)