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
  vec2 size = vec2(textureSize(u_image, 0));
  int level = 0;
  vec2 xy = vec2(gl_FragCoord.xy);
  float red = (xy.x - 0.5)/255.0;
  float green = (xy.y - 0.5)/255.0;
  vec4 colorS = 
  texelFetch(u_image, ivec2(xy+vec2(-1, -1)), level)*u_kernel[0]+
  texelFetch(u_image, ivec2(xy+vec2(0, -1)), level)*u_kernel[1]+
  texelFetch(u_image, ivec2(xy+vec2(1, -1)), level)*u_kernel[2]+
  texelFetch(u_image, ivec2(xy+vec2(-1, 0)), level)*u_kernel[3]+
  texelFetch(u_image, ivec2(xy+vec2(0, 0)), level)*u_kernel[4]+
  texelFetch(u_image, ivec2(xy+vec2(1, 0)), level)*u_kernel[5]+
  texelFetch(u_image, ivec2(xy+vec2(-1, 1)), level)*u_kernel[6]+
  texelFetch(u_image, ivec2(xy+vec2(0,1)), level)*u_kernel[7]+
  texelFetch(u_image, ivec2(xy+vec2(1, 1)), level)*u_kernel[8];
 
  if (xy.x == 239.5 && xy.y == 179.5){
    colorS.r = 1E+8; // marker
  }    
  outColor = vec4( (colorS/ u_kernelWeight).r ,0.0,0.0, 1.0);
}
