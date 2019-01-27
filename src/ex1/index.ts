'use strict'

import * as twgl from 'twgl.js'
import * as debug from 'debug'


const log = debug('example1')

const vertexShaderSource: string = `#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;
out vec4 outp;
void main() {
 

  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace, 0, 1);
}
`

const fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant redish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier = 1) {
    
    const width  = canvas.clientWidth  * multiplier || 0;
    const height = canvas.clientHeight * multiplier || 0;

    log({ width, cw: canvas.clientWidth, height, ch: canvas.clientHeight })
    
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    log(`%c ${gl.getShaderInfoLog(shader)}`, 'color:red');
    gl.deleteShader(shader);
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        log('%c program successfull created', 'color:green')
        return program;
    }
    const rc = gl.getProgramInfoLog(program)
    log(`%c error creating program ${rc}`, 'color:red')
    gl.deleteProgram(program);
}

function start() {
    const canvas: HTMLCanvasElement = <any>document.getElementById('gpu')
    const gl: WebGL2RenderingContext = canvas.getContext('webgl2')
    if (!gl) {
        log('%c no webgl2', 'color:red')
        return
    }
    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) {
        log('%c your webgl2 doesnt support rendering to 32bit textures', 'color:red')
    }
    log('%c webgl2 rendering 32float fully operational', 'color:green')
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;
    const program = createProgram(gl, vertexShader, fragmentShader)

    // init section
   
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // make it the current buffer

    const positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // vertext array object
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao); // make it the current vao
   
    gl.enableVertexAttribArray(positionAttributeLocation) // bind it to the "a_position" attribute
    // tell how data should be presented to the "vec4 a_position"
    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // has no effect because type = gl.FLOAT
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
    )

   

    log('viewpor range', gl.getParameter(gl.MAX_VIEWPORT_DIMS))
    log('current viewportsize', gl.getParameter(gl.VIEWPORT))
    log('gl.canvas size', gl.canvas.width, gl.canvas.height)
    log('canvas size', canvas.width, canvas.height)
    log('canvas clientsize', canvas.clientWidth, canvas.clientHeight)
    log('canvas dims', canvas.style.width, canvas.style.height)

    const canvasStyles = window.getComputedStyle(canvas)
    log('canvasStyles',canvasStyles.width, canvasStyles.height)
    canvas.width = Number.parseInt(canvasStyles.width)
    canvas.height = Number.parseInt(canvasStyles.height)
    
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    log('dbdim',gl.drawingBufferWidth, gl.drawingBufferHeight)
        
    gl.clearColor(0.0, 0.0, 0.0, 0); //transparantblack
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.bindVertexArray(vao);
   
    const primitiveType = gl.TRIANGLES;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);

}

window.addEventListener('load',start)