import { mult, translationMatrix, rotationMatrix, scaleMatrix, vec3, vec2 } from 'mv-redux';

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
    const faces = [
        [
            // Front (facing camera, towards +z)
            [ vec3(-0.5, +0.5, +0.5), vec2(0.0, 0.0) ], // TL
            [ vec3(-0.5, -0.5, +0.5), vec2(0.0, 1.0) ], // BL
            [ vec3(+0.5, +0.5, +0.5), vec2(1.0, 0.0) ], // TR
            [ vec3(+0.5, -0.5, +0.5), vec2(1.0, 1.0) ], // BR
        ],
        [
            // Right (+x)
            [ vec3(+0.5, +0.5, +0.5), vec2(0.0, 0.0) ],
            [ vec3(+0.5, -0.5, +0.5), vec2(0.0, 1.0) ],
            [ vec3(+0.5, +0.5, -0.5), vec2(1.0, 0.0) ],
            [ vec3(+0.5, -0.5, -0.5), vec2(1.0, 1.0) ],
        ],
        [
            // Left (-x)
            [ vec3(-0.5, +0.5, -0.5), vec2(0.0, 0.0) ],
            [ vec3(-0.5, -0.5, -0.5), vec2(0.0, 1.0) ],
            [ vec3(-0.5, +0.5, +0.5), vec2(1.0, 0.0) ],
            [ vec3(-0.5, -0.5, +0.5), vec2(1.0, 1.0) ],
        ],
        [
            // Top (+y)
            [ vec3(-0.5, +0.5, -0.5), vec2(0.0, 0.0) ],
            [ vec3(-0.5, +0.5, +0.5), vec2(0.0, 1.0) ],
            [ vec3(+0.5, +0.5, -0.5), vec2(1.0, 0.0) ],
            [ vec3(+0.5, +0.5, +0.5), vec2(1.0, 1.0) ],
        ],
        [
            // Bottom (-y)
            [ vec3(-0.5, -0.5, +0.5), vec2(0.0, 0.0) ],
            [ vec3(-0.5, -0.5, -0.5), vec2(0.0, 1.0) ],
            [ vec3(+0.5, -0.5, +0.5), vec2(1.0, 0.0) ],
            [ vec3(+0.5, -0.5, -0.5), vec2(1.0, 1.0) ],
        ],
        [
            // Rear (-z)
            [ vec3(+0.5, +0.5, -0.5), vec2(0.0, 0.0) ],
            [ vec3(+0.5, -0.5, -0.5), vec2(0.0, 1.0) ],
            [ vec3(-0.5, +0.5, -0.5), vec2(1.0, 0.0) ],
            [ vec3(-0.5, -0.5, -0.5), vec2(1.0, 1.0) ],
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
