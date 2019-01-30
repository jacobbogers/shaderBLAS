#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;


uniform sampler2D u_image; // our texture
uniform float u_kernel[9];
uniform float u_kernelWeight;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {

  /*vec4 colorSum =
      texture(u_image, v_texCoord + vec2(-1, -1)) * u_kernel[0] +
      texture(u_image, v_texCoord + vec2( 0, -1)) * u_kernel[1] +
      texture(u_image, v_texCoord + vec2( 1, -1)) * u_kernel[2] +
      texture(u_image, v_texCoord + vec2(-1,  0)) * u_kernel[3] +
      texture(u_image, v_texCoord + vec2( 0,  0)) * u_kernel[4] +
      texture(u_image, v_texCoord + vec2( 1,  0)) * u_kernel[5] +
      texture(u_image, v_texCoord + vec2(-1,  1)) * u_kernel[6] +
      texture(u_image, v_texCoord + vec2( 0,  1)) * u_kernel[7] +
      texture(u_image, v_texCoord + vec2( 1,  1)) * u_kernel[8] ;*/
      
  outColor = vec4( gl_FragCoord.xy * vec2(10,10) , 0,1);
}
