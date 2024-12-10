#version 300 es

precision mediump float;

out vec4 fColor;

in vec2 vTexCoord; // Input for texture coordinates

uniform sampler2D uTexture; // Uniform for the texture
uniform vec2 uTexOffset; // final 
uniform vec2 uTexScale;  // 
void main() {
    // Adjust the texture coordinates using scale and offset
    vec2 newTexCoord = (vTexCoord * uTexScale) + uTexOffset; // Scale and offset the UV coordinates
    
    // Sample the texture using the new texture coordinates
    fColor = texture(uTexture, newTexCoord);
}
