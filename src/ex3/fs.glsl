#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

precision highp float;
uniform sampler2D u_image; // our texture
uniform float u_kernel[9];
uniform float u_kernelWeight;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {

  int level = 0;
  ivec2 xy = ivec2(gl_FragCoord.xy);
  vec4 colorSum =
      texelFetch(u_image, xy + ivec2(-1, -1), level) * u_kernel[0] +
      texelFetch(u_image, xy + ivec2( 0, -1), level) * u_kernel[1] +
      texelFetch(u_image, xy + ivec2( 1, -1), level) * u_kernel[2] +
      texelFetch(u_image, xy + ivec2(-1,  0), level) * u_kernel[3] +
      texelFetch(u_image, xy + ivec2( 0,  0), level) * u_kernel[4] +
      texelFetch(u_image, xy + ivec2( 1,  0), level) * u_kernel[5] +
      texelFetch(u_image, xy + ivec2(-1,  1), level) * u_kernel[6] +
      texelFetch(u_image, xy + ivec2( 0,  1), level) * u_kernel[7] +
      texelFetch(u_image, xy + ivec2( 1,  1), level) * u_kernel[8] ;
      
  outColor = vec4(0,0,0,1); //vec4( (colorSum/ u_kernelWeight).rgb ,1);
}
