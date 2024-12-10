#version 300 es

in vec2 aPosition;

uniform vec2 uPosition;
uniform vec2 uScale;
uniform float uRotation;

void main() {
    vec2 pos = aPosition;
    float sin = sin(uRotation);
    float cos = cos(uRotation);

    // Scale
    pos *= uScale;

    // Rotation
    pos = vec2(
        pos.x * cos - pos.y * sin,
        pos.x * sin + pos.y * cos
    );

    // Translation
    pos += uPosition;

    gl_Position = vec4(pos, 0, 1);
}
