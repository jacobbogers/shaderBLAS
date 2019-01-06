

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
    console.log('webgl2 rendering 32float fully operational')
})()


