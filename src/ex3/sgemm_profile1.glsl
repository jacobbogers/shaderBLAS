#version 300 es

precision highp float;

uniform sampler2D A;
uniform sampler2D B;
uniform sampler2D Cn;
uniform int m;
uniform int n;
uniform int k;
uniform float alpha;
uniform float beta;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
   ivec2 xy = ivec2(gl_FragCoord.xy);
   float sum = 0.0;
   if (alpha != 0.0) {
     for (int j = 0; j < k; j++){
         sum += texelFetch(A, ivec2(xy.x, j)), 0) * texelFetch(B, ivec(j,xy.y), 0);
     }
   }
   if (beta != 1.0)
      sum = sum * alpha + beta*texelFetch(Cn, xy, 0);
   }
   else {
      sum + sum + texelFetch(Cn, xy, 0);
   }
   outColor = sum;
}
