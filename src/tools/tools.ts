
export type createContextReturn = {
    supported: string[],
    ext: string[],
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    compileProgram(vs: string, fs: string): [WebGLProgram?, string?],
    getLocations(program: WebGLProgram, type: 'uniform' | 'attribute', names: string[]): [(GLint | WebGLUniformLocation)?, Error?]
}

export function createContext(extensions: string[] = [], trowIfFail = true): [createContextReturn?, Error?] {
    const canvas = document.createElement('canvas')
    if (!canvas) {
        return [null, new Error(`Could not create canvas`)]
    }
    const gl = canvas.getContext('webgl2')
    if (!gl) {
        return [null, new Error(`No webgl2 available`)]
    }
    const registered = extensions.map<[string, any]>(extension => [extension, gl.getExtension(extension)])
    const errors = registered.filter(f => !f[1]).map(f => f[0]) // get the "falsies"
    if (errors.length) {
        if (trowIfFail) {
            return [null, new Error(`These extentions could not be registered:${JSON.stringify(errors)}`)]
        }
    }

    function makeShader(type: GLenum, src: string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return [null, gl.getShaderInfoLog(shader)];
        }
        return [shader, null];

    }

    function compileProgram(vs: string, fs: string) {

        const errors = [];
        const [vsh, e1] = makeShader(gl.VERTEX_SHADER, vs);
        const [fsh, e2] = makeShader(gl.FRAGMENT_SHADER, fs);

        if (e1) errors.push(`[vectorShader:${e1}]`)
        if (e2) errors.push(`[fragmentShader:${e2}]`)

        if (errors.length) {
            return [null, errors.join(',')]
        }
        // all ok
        //create program
        const program = gl.createProgram();
        //attach and link shaders to the program
        gl.attachShader(program, vsh);
        gl.attachShader(program, fsh);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return [null, gl.getProgramInfoLog(program)];
        }
        return [program, null]
    }






    function getLocations(program: WebGLProgram, type: 'u' | 'a', names: string[]) {
           const rc = {}
           
           for (const name of names){
               if (type === 'u'){
                   rc[name] = gl.getUniformLocation(name)
               }
               rc[name] = gl.getAttribLocation
           }
           const fn = gl.getAttribLocation
           return gl.getAttribLocation(program, names[0])
            /*const found = names.reduce((col, name: string) => {
                col[name] = fn(program, name)
                return col
            }, {} as { [index: string]: GLint | WebGLUniformLocation })
            return [found, null]*/
        }
    

    const supported = gl.getSupportedExtensions()
    const ext = new Map(registered)
    const rc = Object.defineProperties({}, {
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
        },
        compileProgram: {
            value: compileProgram,
            writeable: false,
            configurable: false,
            enumerable: true
        },
        getLocations: {
            value: getLocations,
            writeable: false,
            configurable: false,
            enumerable: true
        }



    })
    return [rc, null]
}

export async function loadImage(url: string) {

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true
    xhr.overrideMimeType('application/octet-stream')
    const rc: any = new Promise((resolve, reject) => {
        xhr.addEventListener("readystatechange", event => {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status >= 200 && xhr.status < 299) {
                    resolve({ responseType: xhr.responseType, data: xhr.response })
                }
                reject(xhr.statusText)
            }
        });
        xhr.addEventListener('error', reject)
        xhr.addEventListener('timeout', reject)
        xhr.open('get', url)
        xhr.setRequestHeader('Content-Type', 'application/octet-stream')
        xhr.responseType = 'blob'
        xhr.send()
    }).then((response: { responseType: XMLHttpRequestResponseType, data: any }) => {
        const img = new Image()
        img.addEventListener('load', () => URL.revokeObjectURL(img.src))
        img.src = URL.createObjectURL(response.data)
        return img
    })
    rc['xhr'] = xhr
    return rc
}
