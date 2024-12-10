#version 300 es

in vec2 aPosition;
in vec3 aColor; 
out vec3 vColor; 

void main() {
    gl_Position = vec4(aPosition, 0, 1);
    vColor = aColor;
}
