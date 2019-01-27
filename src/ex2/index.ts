import * as twgl from 'twgl.js'
import * as debug from 'debug'

const log = debug('example2')

const vs = `#version 300 es
void main() {
  gl_Position = vec4(0, 0, 0, 1);
  gl_PointSize = 100.0;
}
`;

const fs = `#version 300 es
precision highp float;
uniform sampler2D tex;
uniform int numArrays;
out vec4 outColor;
void main() {
  int level = 0;
  int start = int(gl_FragCoord.x);
  ivec2 size = textureSize(tex, level);
  vec4 color = vec4(0);
  for (int y = 0; y < size.y; ++y) {
    for (int x = start; x < size.x; x += numArrays) {
      color += texelFetch(tex, ivec2(x, y), level);
    }
  }
  outColor = color / float(size.x / numArrays * size.y);
}
`;


function main() {
  
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) {
    return alert('need webgl2');
  }

  const prg = twgl.createProgramFromSources(gl, [vs, fs]);

  const numArraysLoc = gl.getUniformLocation(prg, "numArrays");

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // so we don't need mips
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // so we can pass a non multiple of 4 bytes
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  const numArrays = 5;
  const values = new Uint8Array([
     1, 1, 1, 1, 1,
     2, 150, 231, 9, 71,
     3, 129, 290, 3, 90,
     4, 141, 300, 2, 80,
     5, 123, 212, 4, 75,
  ]);
  const width = values.length;
  const height = 1;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, values);
  
  gl.canvas.width = numArrays;
  gl.canvas.height = 1;
  gl.viewport(0, 0, numArrays, 1);

  gl.useProgram(prg);
  gl.uniform1i(numArraysLoc, numArrays);
  gl.drawArrays(gl.POINTS, 0, 1);
  
  const gpuData = new Uint8Array(4 * numArrays);
  // TODO: use an output texture with a single channel instead of RGBA, nice
  gl.readPixels(0, 0, numArrays, 1, gl.RGBA, gl.UNSIGNED_BYTE, gpuData);
  const gpuAverages = [];
  for (let i = 0; i < numArrays; ++i) {
    gpuAverages.push(gpuData[i * 4]); // Because we're only using the RED channel
  }
  log('gpuAverage:', gpuAverages.join(', '));

}

window.addEventListener('load', main)
