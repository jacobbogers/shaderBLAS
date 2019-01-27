export function createContext(extensions:string[] = [], trowIfFail = true): { supported: string[], ext: string[], canvas:HTMLCanvasElement, gl: WebGL2RenderingContext }{
    const canvas = document.createElement('canvas')
    if (!canvas){
        throw new Error(`Could not create canvas`)
    }
    const gl = canvas.getContext('webgl2')
    if (!gl){
        throw new Error(`No webgl2 available`)
    }
    const registered = extensions.map<[string, any]>( extension => [extension, gl.getExtension(extension)])
    const errors = registered.filter( f => !f[1]).map( f => f[0]) // get the "falsies"
    if (errors.length){
        if (trowIfFail){
          throw new Error(`These extentions could not be registered:${JSON.stringify(errors)}`)
        }
    }
    const supported = gl.getSupportedExtensions()
    const ext = new Map(registered)
    const rc = {}
    Object.defineProperties(rc, {
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
    }) 
    return rc as { supported: string[], ext: string[], canvas:HTMLCanvasElement, gl: WebGL2RenderingContext }
}

export async function loadImage(url: string) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true
    xhr.overrideMimeType('application/octet-stream')
    const rc: any = new Promise((resolve, reject)=>{
        xhr.addEventListener("readystatechange", event => {
            if (xhr.readyState === xhr.DONE){
                if (xhr.status >= 200 && xhr.status < 299){
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
    }).then((response : { responseType: XMLHttpRequestResponseType, data: any })=>{
        const img = new Image()
        img.addEventListener('load', ()=> URL.revokeObjectURL(img.src) )
        img.src = URL.createObjectURL(response.data)
        return img
    })
    rc['xhr'] = xhr
    return rc
}
