import { mat4, radians, vec3, translationMatrix, scaleMatrix, rotationMatrix, mult } from 'mv-redux';


/**
 * @typedef ShapeOptions Configuration options for constructing a new shape.
 * @property {import('mv-redux').Vec3} [position]
 * @property {import('mv-redux').Vec3} [scale]
 * @property {import('mv-redux').Vec3} [rotation]
 */


/**
 * A class that wraps the properties of a 3D shape.
 */
export class SceneObject {
    position;
    rotation;
    scale;


    /**
     * @param {ShapeOptions} [options] Initial parameters for position, rotation, and scale.
     */
    constructor(options = {}) {
        this.position = options?.position ?? vec3(0, 0, 0);
        this.rotation = options?.rotation ?? vec3(0, 0, 0);
        this.scale = options?.scale ?? vec3(1, 1, 1);
    }


    /**
     * Computes this shape's current transformation matrix.
     * @returns {import('mv-redux').Mat4}
     */
    getModelMatrix() {
        // =========================================================================================
        // Construct the model matrix for this shape and return it:

        // Translation matrix
        const translation = translationMatrix(this.position);
        
        // Scale matrix
        const scale = scaleMatrix(this.scale);

        // Rotation matrices for each axis
        const rotationX = rotationMatrix('x', this.rotation[0]);
        const rotationY = rotationMatrix('y', this.rotation[1]);
        const rotationZ = rotationMatrix('z', this.rotation[2]);

        // Combine the matrices: translation * rotation * scale
        const modelMatrix = mult(
            translation, 
            mult(rotationZ, mult(rotationY, mult(rotationX, scale)))
        );

        // Return the combined model matrix
        return modelMatrix;

        // =========================================================================================
    }
}


/**
 * Generates vertex data for a triangular pyramid.
 * @returns {Float32Array} The vertex data.
 */
export function generatePyramidVertices() {
    const TIP = 0;
    const FRONT = 1;
    const LEFT = 2;
    const RIGHT = 3;

    const positions = [
        vec3(0.0, +0.35, 0.0), // tip
        vec3(Math.cos(radians(270)) * 0.5, -0.35, Math.sin(radians(270)) * 0.5),
        vec3(Math.cos(radians(150)) * 0.5, -0.35, Math.sin(radians(150)) * 0.5),
        vec3(Math.cos(radians( 30)) * 0.5, -0.35, Math.sin(radians( 30)) * 0.5),
    ];

    const colors = [
        vec3(0.00, 0.85, 0.85), // c
        vec3(0.85, 0.00, 0.85), // m
        vec3(0.85, 0.85, 0.00), // y
        vec3(0.85, 0.85, 0.85), // light gray
    ];

    const faces = [
        [ TIP, LEFT, FRONT ],
        [ TIP, FRONT, RIGHT ],
        [ TIP, RIGHT, LEFT ],
        [ FRONT, LEFT, RIGHT ],
    ];

    // 4 faces × 3 vertices × 2 attributes × 3 floats
    const data = new Float32Array(4 * 3 * 2 * 3);

    let ptr = 0;
    for (const face of faces) {
        for (const index of face) {
            const vPosition = positions[index];
            const vColor = colors[index];

            data.set(vPosition, ptr);   // Insert 3 numbers for position
            data.set(vColor, ptr + 3);  // Insert 3 more for colour
            ptr += 6;                   // Increment pointer by 6
        }
    }

    return data;
}
