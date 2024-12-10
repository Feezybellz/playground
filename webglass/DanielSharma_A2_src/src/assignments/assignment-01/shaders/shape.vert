#version 300 es

in vec3 aPosition;  
in vec3 aColor;     

out vec3 vColor;    

// Uniforms for transformations
uniform vec3 uScale;
uniform vec3 uPosition;
uniform float uRotationX;
uniform float uRotationY;
uniform float uRotationZ;

void main() {
    
    vec3 scaledPosition = aPosition * uScale;

    // Rotation 
    float sinX = sin(uRotationX);
    float cosX = cos(uRotationX);
    vec3 rotatedPositionX = vec3(
        scaledPosition.x,
        scaledPosition.y * cosX - scaledPosition.z * sinX,
        scaledPosition.y * sinX + scaledPosition.z * cosX
    );

   
    float sinY = sin(uRotationY);
    float cosY = cos(uRotationY);
    vec3 rotatedPositionXY = vec3(
        rotatedPositionX.x * cosY + rotatedPositionX.z * sinY,
        rotatedPositionX.y,
        -rotatedPositionX.x * sinY + rotatedPositionX.z * cosY
    );

    
    float sinZ = sin(uRotationZ);
    float cosZ = cos(uRotationZ);
    vec3 rotatedPositionXYZ = vec3(
        rotatedPositionXY.x * cosZ - rotatedPositionXY.y * sinZ,
        rotatedPositionXY.x * sinZ + rotatedPositionXY.y * cosZ,
        rotatedPositionXY.z
    );

    
    gl_Position = vec4(rotatedPositionXYZ + uPosition, 1.0);

    
    vColor = aColor;
}
