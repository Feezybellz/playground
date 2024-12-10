import { radians, vec3 } from 'mv-redux';
import { compileShader, linkProgram } from 'mv-redux/init';

import vertSource from './shaders/shape.vert';
import fragSource from './shaders/shape.frag';

// ---- !!! Lab solutions note !!! -----------------------------------------------------------------
// If you are going to use this class as a reference for later labs and assignments, take note of
// the fact that this class is not particularly efficient (e.g., every new pyramid compiles its own
// whole program and makes its own buffer, even though they all use identical shaders and data).
//
// The idea is that this class is a basic example, and you will investigate more "proper" ways to
// architect/design your objects later in the course (e.g. on assignments). There are all sorts of
// design patterns you can use to make more efficient use of GPU resources. Make Omar proud!
// -------------------------------------------------------------------------------------------------

/**
 * @typedef ShapeOptions Configuration options for constructing a new shape.
 * @property {import('mv-redux').Vec3} [position]
 * @property {import('mv-redux').Vec3} [scale]
 * @property {import('mv-redux').Vec3} [rotation]
 */

/**
 * A triangular pyramid.
 */
export class Pyramid {
    position;
    rotation;
    scale;

    // ------------------------------------------------------------

    #gl;
    #vao;
    #program;
    #uLocations;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {ShapeOptions} [options] Initial parameters for position, rotation, and scale.
     */
    constructor(gl, options = {}) {
        this.#gl = gl;

        // Instance properties
        // -------------------

        this.position = options?.position ?? vec3(0, 0, 0);
        this.rotation = options?.rotation ?? vec3(0, 0, 0);
        this.scale = options?.scale ?? vec3(1, 1, 1);

        // Program and uniforms
        // --------------------

        this.#program = linkProgram(
            gl,
            compileShader(gl, gl.VERTEX_SHADER, vertSource),
            compileShader(gl, gl.FRAGMENT_SHADER, fragSource),
        );

        this.#uLocations = {
            uPosition: gl.getUniformLocation(this.#program, 'uPosition'),
            uRotation: gl.getUniformLocation(this.#program, 'uRotation'),
            uScale: gl.getUniformLocation(this.#program, 'uScale'),
        };

        // Vertex data and attributes
        // --------------------------

        // This is the "VAO" that was mentioned in the Tips & Resources section of the first
        // assignment. While it is bound, any calls to `bindBuffer`, `vertexAttribPointer`, etc.
        // will be "stored". Then, in the future, we can re-bind this VAO and it will bring back all
        // of the vertex & buffer configurations we just set on it (see below in `draw()`).
        this.#vao = gl.createVertexArray();
        gl.bindVertexArray(this.#vao);

        const vertexData = Pyramid.generateVertexData();

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(this.#program, 'aPosition');
        const aColor = gl.getAttribLocation(this.#program, 'aColor');

        const F32 = Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, F32 * 6, F32 * 0);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, F32 * 6, F32 * 3);

        gl.enableVertexAttribArray(aPosition);
        gl.enableVertexAttribArray(aColor);

        // Done, unbind for now
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
     * Draws this shape.
     */
    draw() {
        const gl = this.#gl;
        const { uPosition, uScale, uRotation } = this.#uLocations;

        // Since we're using a VAO (see note in constructor), instead of having to re-bind our
        // buffers and reconfigure our vertex attributes, we can simply bind the one VAO. Not only
        // is this simpler in-code, but it means the CPU has to make fewer calls to the graphics
        // card, and so it is also more efficient due to significantly reduced overhead.
        gl.useProgram(this.#program);
        gl.bindVertexArray(this.#vao);

        gl.uniform3fv(uPosition, this.position);
        gl.uniform3fv(uRotation, this.rotation);
        gl.uniform3fv(uScale, this.scale);

        gl.drawArrays(gl.TRIANGLES, 0, 4 * 3); // 4 faces, 3 verts each

        gl.bindVertexArray(null);
        gl.useProgram(null);
    }

    /**
     * Generates a copy of vertex data for a new {@link Pyramid} instance.
     * @private
     * @returns {Float32Array} The vertex data.
     */
    static generateVertexData() {
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
}
