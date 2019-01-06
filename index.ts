'use strict'
const vertexShaderSource: string = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
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

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(`%c ${gl.getShaderInfoLog(shader)}`, 'color:red');
    gl.deleteShader(shader);
}

(function start() {
    const canvas: HTMLCanvasElement = <any>document.getElementById('gpu')
    const gl: WebGLRenderingContext = <WebGLRenderingContext>canvas.getContext('webgl2')
    if (!gl) {
        console.log('%c no webgl2', 'color:red')
        return
    }
    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) {
        console.log('%c your webgl2 doesnt support rendering to 32bit textures', 'color:red')
    }
    gl.VERTEX_SHADER
    console.log('webgl2 rendering 32float fully operational')
})()

