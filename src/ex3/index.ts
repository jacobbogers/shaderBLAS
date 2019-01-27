import * as debug from 'debug'
import { createContext  } from '../tools/tools'

import fs from './fs.glsl'
import vs from './vs.glsl'
import pic from '../assets/leaves.jpg'

const log = debug('example3')



function start(){
  const ctx = createContext()
  log('%o', ctx);
  log('leaves: %s', pic)
  log('frag shader %s', fs)
  log('vect shader %s', vs)
}

window.addEventListener('load', start)