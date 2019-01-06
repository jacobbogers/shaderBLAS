# webgl2 notes

```javascript
var gl = canvas.getContext('webgl2')
// get all extentions
console.log(gl.getSupportedExtensions())
/*
[
    "EXT_color_buffer_float", <-- webgl2 needs this to render to float output textbuffer 
    "EXT_disjoint_timer_query_webgl2", 
    "EXT_texture_filter_anisotropic", 
    "OES_texture_float_linear", 
    "WEBGL_compressed_texture_s3tc", 
    "WEBGL_compressed_texture_s3tc_srgb", 
    "WEBGL_debug_renderer_info", 
    "WEBGL_debug_shaders", 
    "WEBGL_lose_context"
]
*/

const ext = gl.getExtension('EXT_color_buffer_float')

/*
the following become rendable
gl.R16F,
gl.RG16F,
gl.RGBA16F,
gl.R32F,
gl.RG32F,
gl.RGBA32F,
gl.R11F_G11F_B10F.
*/
```

# 4 ways shaders can get data

## 1  Attributes,buffers, vertex arrays

* buffers: positions, normals, texture coordinates, vertex colors, etc although you're free to put anything you want in them.
* attributes: specify how you pull data out of your buffers and provide them to vertex shader.
* vertex arrays (array of vertices of `typedArray`)

```quote
Buffers are not random access. Instead a vertex shaders is executed a specified number of times. Each time it's executed the next value from each specified buffer is pulled out assigned to an attribute. 

The state of attributes, which buffers to use for each one and how to pull out data from those buffers, is collected into a vertex array object (VAO).
```

## 2 Uniforms

Uniforms are effectively global variables you set before you execute your shader program.

## 3 Textures

Textures can be randomly accessed in the shader program

## 4 varyings

How vertex shaders pass data to fragment shaders, depending on what is being rendered the values are interpolated
while executing the fragment shader

