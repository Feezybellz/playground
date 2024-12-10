#version 300 es

in vec3 aPosition;
in vec3 aColor;

out vec3 vColor;

uniform vec3 uPosition;
uniform vec3 uRotation;
uniform vec3 uScale;

void main() {
    // Translation matrix
    mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        uPosition.x, uPosition.y, uPosition.z, 1.0
    );

    // Scaling matrix
    mat4 scaleMatrix = mat4(
        uScale.x, 0.0, 0.0, 0.0,
        0.0, uScale.y, 0.0, 0.0,
        0.0, 0.0, uScale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // Rotation matrices for X, Y, and Z axes
    mat4 rotationX = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, cos(uRotation.x), -sin(uRotation.x), 0.0,
        0.0, sin(uRotation.x), cos(uRotation.x), 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 rotationY = mat4(
        cos(uRotation.y), 0.0, sin(uRotation.y), 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sin(uRotation.y), 0.0, cos(uRotation.y), 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 rotationZ = mat4(
        cos(uRotation.z), -sin(uRotation.z), 0.0, 0.0,
        sin(uRotation.z), cos(uRotation.z), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );


    mat4 modelMatrix = translationMatrix * (rotationZ * rotationY * rotationX) * scaleMatrix;

    gl_Position = modelMatrix * vec4(aPosition, 1.0);

    
    vColor = aColor;
}
