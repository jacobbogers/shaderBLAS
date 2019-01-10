export function createContext(extensions:string[], trowIfFail = true){
    const canvas = document.createElement('canvas')
    if (!canvas){
        throw new Error(`Could not create canvas`)
    }
    const gl = canvas.getContext('webgl2')
    if (!gl){
        throw new Error(`no webgl2 available`)
    }
    const registered = extensions.map<[string, any]>( extension => [extension, gl.getExtension(extension)])
    const errors = registered.filter( f => !f[1]).map( f => f[0]) // get the "falsies"
    if (errors.length){
        if (trowIfFail){
          throw new Error(`these extentions could not be registered:${JSON.stringify(errors)}`)
        }
    }
    const supported = gl.getSupportedExtensions()
    const ext = new Map(registered)
    const rc = {}
    Object.defineProperties(rc, {
        supported: {
            value: supported,
            writeable: false,
            configurable: false,
            enumerable: false
        },
        ext: {
            value: ext,
            writeable: false,
            configurable: false,
            enumerable: false
        },
        canvas: {
            value: canvas,
            writeable: false,
            configurable: false,
            enumerable: false
        },
        gl: {
            value: gl,
            writeable: false,
            configurable: false,
            enumerable: true
        }
    })
    return rc;
}

/*
const vs = `#version 300 es
void main() {
  gl_Position = vec4(0, 0, 0, 1);
  gl_PointSize = 1.0;
}
`;

const fs = `#version 300 es
precision highp float;
uniform sampler2D tex;
out vec4 outColor;
void main() {
  int level = 0;
  ivec2 size = textureSize(tex, level);
  vec4 color = vec4(0);
  for (int y = 0; y < size.y; ++y) {
    for (int x = 0; x < size.x; ++x) {
      color += texelFetch(tex, ivec2(x, y), level);
    }
  }
  outColor = color / float(size.x * size.y);
}
`;

function main() {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) {
    return alert('need webgl2');
  }
  const prg = twgl.createProgram(gl, [vs, fs]);
  
  gl.canvas.width = 1;
  gl.canvas.height = 1;
  gl.viewport(0, 0, 1, 1);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // so we don't need mips
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // so we can pass a non multiple of 4 bytes
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  
  const values = new Uint8Array([10, 255, 13, 70, 56, 45, 89]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, values.length, 1, 0, gl.RED, gl.UNSIGNED_BYTE, values);
  
  gl.useProgram(prg);
  gl.drawArrays(gl.POINTS, 0, 1);
  
  const gpuAverage = new Uint8Array(4);
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, gpuAverage);
  
  const jsAverage = values.reduce((s, v) => s + v) / values.length;
  
  console.log('gpuAverage:', gpuAverage[0]);
  console.log('jsAverage:', jsAverage);
}

main();
*/

export function getExtentions(fn: get)




    return function extentions()
    // defensive 
    const supported = WebGLRenderingContext.getSupportedExtensions
    const select = new Map<string, any>(
        extensions.map<[string, any]>( extension => [ extension, gl.getExtension( extension)] )
    )
    //find 
    
    /*if (select.find()){

    
    }*/

}

if (!gl) {
    console.log('%c no webgl2', 'color:red')
    return
}
const ext = gl.getExtension('EXT_color_buffer_float')
if (!ext) {
    console.log('%c your webgl2 doesnt support rendering to 32bit textures', 'color:red')
}