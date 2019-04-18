#version 300 es
void main() {
    int x = gl_VertexID % 2;
    int y = (gl_VertexID / 2 + gl_VertexID / 3) % 2;    
    gl_Position = vec4(ivec2(x, y) * 2 - 1, 0, 1);
}