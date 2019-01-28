import * as debug from 'debug'
import { createContext, loadImage } from '../tools/tools'

const fs: string = require('./fs.glsl')
const vs: string = require('./vs.glsl')
const pic: string = require('../assets/leaves.jpg')

const log = debug('example3')

async function start() {

  const jpeg = await loadImage(pic);

  const [ctx, err] = createContext()
  if (err) {
    log(`%c ${err}`, 'color:red')
    return
  }



  const [program, error] = ctx.compileProgram(vs, fs)
  if (error) {
    log(`%c ${error}`, 'color:red')
    return
  }
  log(`%c we have a program ${program}`, 'color:green')
  
  var positionAttributeLocation = ctx.gl.getAttribLocation(program, "a_position");
  console.log(positionAttributeLocation)
  const attributes = ctx.getLocations(program,'attribute', ['a_position','a_texCoord'])
  //const uniforms = ctx.getLocations(program, 'uniform', ['u_resolution', 'u_image', 'u_kernel[0]', 'u_kernelWeight','u_flipY'])


  //log('uniforms: %o', uniforms)
  //log('attributes: %o', attributes)
}

window.addEventListener('load', start)