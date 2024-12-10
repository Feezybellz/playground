#version 300 es

// Using these `layout` qualifiers stops us from having to call `gl.getAttribLocation`, since we can
// set the locations ourselves manually. Only works on `in` attributes, not uniforms (in WebGL,
// anyways).
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aColor;

out vec3 vColor;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
    vColor = aColor;
}
