#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  
  ivec2 p = ivec2(gl_FragCoord.xy);

  float v = float( p.y*3 + p.x );

  if (p.x == 1){
    discard; 
  }
 
  outColor = vec4( v, 0.0, 0.0, 0.0);
}
