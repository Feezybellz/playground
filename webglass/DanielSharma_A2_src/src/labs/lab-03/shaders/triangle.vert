#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;
uniform float uScale;
uniform vec2 uPosition; 

void main() {
    gl_Position = vec4(aPosition * uScale + uPosition, 0, 1);
    vColor = aColor;
}
