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

//transA=x, transB=N,
//(m x n) = alpha * (k x m) x (k x n) + beta * (m x n)  --> checked, ok

void main() {
   ivec2 ij = ivec2(gl_FragCoord.xy);
   float temp = 0.0;
   if (alpha != 0.0) {
     for (int l = 0; l < k; l++){
         temp += texelFetch(A, ivec2(ij.i,l)), 0) * texelFetch(B, ivec(l,ij.j), 0);
     }
   }
   if (beta != 1)
      sum = sum * alpha + beta*texelFetch(Cn, xy, 0);
   }
   else {
      sum + sum + texelFetch(Cn, xy, 0);
   }
   outColor = vec4(sum,0.0,0.0,1.0);
}
