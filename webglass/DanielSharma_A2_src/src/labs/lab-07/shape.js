import { radians, mult, translationMatrix, rotationMatrix, scaleMatrix, vec3 } from 'mv-redux';


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
        const sMat = scaleMatrix(this.scale);
        const tMat = translationMatrix(this.position);

        const rMatX = rotationMatrix('x', this.rotation.x);
        const rMatY = rotationMatrix('y', this.rotation.y);
        const rMatZ = rotationMatrix('z', this.rotation.z);
        const rMat = mult(mult(rMatZ, rMatY), rMatX);

        return mult(mult(tMat, rMat), sMat);
    }
}



/**
 * Generates vertex data for a cube.
 * @returns {Float32Array} The vertex data.
 */
export function generateCubeVertices() {
    const colors = {
        r: vec3(1.0, 0.0, 0.0),
        g: vec3(0.0, 1.0, 0.0),
        b: vec3(0.0, 0.0, 1.0),
        c: vec3(0.0, 1.0, 1.0),
        m: vec3(1.0, 0.0, 1.0),
        y: vec3(1.0, 1.0, 0.0),
    };

    const faces = [
        [
            // Front (facing camera, towards +z)
            [ vec3(-0.5, +0.5, +0.5), colors.r ],
            [ vec3(-0.5, -0.5, +0.5), colors.r ],
            [ vec3(+0.5, +0.5, +0.5), colors.r ],
            [ vec3(+0.5, -0.5, +0.5), colors.r ],
        ],
        [
            // Right
            [ vec3(+0.5, +0.5, +0.5), colors.g ],
            [ vec3(+0.5, -0.5, +0.5), colors.g ],
            [ vec3(+0.5, +0.5, -0.5), colors.g ],
            [ vec3(+0.5, -0.5, -0.5), colors.g ],
        ],
        [
            // Left
            [ vec3(-0.5, +0.5, +0.5), colors.b ],
            [ vec3(-0.5, -0.5, +0.5), colors.b ],
            [ vec3(-0.5, +0.5, -0.5), colors.b ],
            [ vec3(-0.5, -0.5, -0.5), colors.b ],
        ],
        [
            // Top
            [ vec3(-0.5, +0.5, -0.5), colors.c ],
            [ vec3(-0.5, +0.5, +0.5), colors.c ],
            [ vec3(+0.5, +0.5, -0.5), colors.c ],
            [ vec3(+0.5, +0.5, +0.5), colors.c ],
        ],
        [
            // Bottom
            [ vec3(-0.5, -0.5, -0.5), colors.m ],
            [ vec3(-0.5, -0.5, +0.5), colors.m ],
            [ vec3(+0.5, -0.5, -0.5), colors.m ],
            [ vec3(+0.5, -0.5, +0.5), colors.m ],
        ],
        [
            // Rear
            [ vec3(-0.5, +0.5, -0.5), colors.y ],
            [ vec3(-0.5, -0.5, -0.5), colors.y ],
            [ vec3(+0.5, +0.5, -0.5), colors.y ],
            [ vec3(+0.5, -0.5, -0.5), colors.y ],
        ],
    ];

    // Quad vertices to double-triangle vertices:
    // [ 1, 2, 3, 4 ] --> [ 1, 2, 3 ] [ 4, 3, 2 ]
    // Duplicate the 3rd and 2nd vertices.
    for (const face of faces) {
        face.push(face[2], face[1]);
    }

    // Now we can flatten it all down.
    return new Float32Array(faces.flat(3));
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
