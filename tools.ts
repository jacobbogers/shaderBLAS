
export function createGL(canvas: HTMLCanvasElement, extensions: string[] = ['EXT_color_buffer_float']){
    const gl = canvas.getContext('webgl2')
    if (!gl){
        throw new Error(`no webgl2 available`)
    }

    const select = new Map()

    extensions.reduce( ( map , v ) => {
        map.set(v, gl.getExtension(v))
        return map
    }, select )
    
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