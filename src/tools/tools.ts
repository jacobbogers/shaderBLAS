"use strict";

export interface CreateContextReturn {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  supported: string[];
}

export interface ProgramContextReturn {
  program: WebGLProgram;
  registerUniforms: (names: string[]) => void;
  registerAttributes: (names: string[]) => void;
  getAttribute(name: string): GLint;
  getUniform(name: string): WebGLUniformLocation;
}

function compileProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string
): [WebGLProgram, Error] {
  function makeShader(type: GLenum, src: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return [null, new Error(gl.getShaderInfoLog(shader))];
    }
    return [shader, null];
  }

  const errors = [];
  const [vsh, e1] = makeShader(gl.VERTEX_SHADER, vs);
  const [fsh, e2] = makeShader(gl.FRAGMENT_SHADER, fs);

  if (e1) errors.push(`[vectorShader: ${e1}]`);
  if (e2) errors.push(`[fragmentShader: ${e2}]`);

  if (errors.length) {
    return [null, new Error(errors.join(","))];
  }

  const program = gl.createProgram();
  gl.attachShader(program, vsh);
  gl.attachShader(program, fsh);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return [null, new Error(gl.getProgramInfoLog(program))];
  }
  return [program, null];
}

export function createGLContext(
  extensions: string[] = [],
  trowIfFail = true
): [CreateContextReturn, Error] {
  const canvas = document.createElement("canvas");
  if (!canvas) {
    return [null, new Error(`Could not create canvas`)];
  }
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return [null, new Error(`No webgl2 available`)];
  }

  const registered = extensions.map<[string, any]>(extension => [
    extension,
    gl.getExtension(extension)
  ]);
  const errors = registered.filter(f => !f[1]).map(f => f[0]); // get the "falsies"

  if (errors.length) {
    if (trowIfFail) {
      return [
        null,
        new Error(
          `These extentions could not be registered:${JSON.stringify(errors)}`
        )
      ];
    }
  }

  const supported = gl.getSupportedExtensions();
  const ext = new Map(registered);
  const rc: CreateContextReturn  = Object.defineProperties(
    {},
    {
      supported: {
        value: Object.freeze(supported),
        writeable: false,
        configurable: false,
        enumerable: false
      },
      ext: {
        value: Object.freeze(ext),
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
    }
  );
  return [rc, null];
}

export function createProgramContext(
  ctx: CreateContextReturn,
  vs: string,
  fs: string
): [ProgramContextReturn, Error] {
  const [program, err] = compileProgram(ctx.gl, vs, fs);
  if (err) {
    return [null, err];
  }

  const attribs = new Map<string, GLint>();
  const uniforms = new Map<string, WebGLUniformLocation>();

  function registerUniforms(names: string[]) {
    const { gl } = ctx;
    for (const name of names) {
      const loc = gl.getUniformLocation(program, name);
      if (loc !== undefined || loc !== null) {
        uniforms.set(name, loc);
      }
    }
  }

  function registerAttributes(names: string[]) {
    const { gl } = ctx;
    for (const name of names) {
      const loc = gl.getAttribLocation(program, name);
      if (loc !== undefined || loc !== null) {
        attribs.set(name, loc);
      }
    }
  }

  function getAttribute(name: string) {
    return attribs.get(name);
  }

  function getUniform(name: string) {
    return uniforms.get(name);
  }

  return [
    {
      program,
      registerUniforms,
      registerAttributes,
      getAttribute,
      getUniform
    },
    null
  ];
}


export async function loadImage(url: string) {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.overrideMimeType("application/octet-stream");
  const rc: any = new Promise((resolve, reject) => {
    xhr.addEventListener("readystatechange", event => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status >= 200 && xhr.status < 299) {
          resolve({ responseType: xhr.responseType, data: xhr.response });
        }
        reject(xhr.statusText);
      }
    });
    xhr.addEventListener("error", reject);
    xhr.addEventListener("timeout", reject);
    xhr.open("get", url);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.responseType = "blob";
    xhr.send();
  }).then(
    (response: { responseType: XMLHttpRequestResponseType; data: any }) => {
      return new Promise((resolve)=>{
        const img = new Image();
        img.onload = () => {
           URL.revokeObjectURL(img.src);
           resolve(img)
        }
        img.src = URL.createObjectURL(response.data);
      })
    }
  );
  rc["xhr"] = xhr;
  return rc;
}
