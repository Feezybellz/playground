import { vec2, vec4 } from 'mv-redux';
import { linkProgram, compileShader } from 'mv-redux/init';

import vertSource from './shaders/shape.vert';
import fragSource from './shaders/shape.frag';


/**
 * @typedef SquareOptions A configuration object for the {@link Square} class's constructor.
 * @property {import('mv-redux').Vec3 | import('mv-redux').Vec4} [color]
 * @property {import('mv-redux').Vec2} [position]
 * @property {import('mv-redux').Vec2} [scale]
 * @property {number} [rotation]
 */


/**
 * A 2D square.
 */
export class Square {
    position;
    rotation;
    scale;
    color;

    // ------------------------------------------------------------------------

    #gl;
    #vao;
    #program;
    #uLocations;

    /**
     * Creates a new square.
     * @param {WebGL2RenderingContext} gl
     * @param {SquareOptions} [options] An initial position, rotation, and scale for this
     * square.
     */
    constructor(gl, options = {}) {
        this.#gl = gl;

        // Instance properties
        // -------------------

        this.color = options.color ? vec4(options.color, 1) : vec4(1, 1, 1, 1);
        this.position = options.position ?? vec2(0, 0);
        this.rotation = options.rotation ?? 0.0;
        this.scale = options.scale ?? vec2(1, 1);

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
            uColor: gl.getUniformLocation(this.#program, 'uColor'),
        };

        // Vertex data and attributes
        // --------------------------

        this.#vao = gl.createVertexArray();
        gl.bindVertexArray(this.#vao);

        const vertexData = new Float32Array([
            vec2(-1, +1), vec2(-1, -1), vec2(+1, +1), // TL, BL, TR
            vec2(+1, +1), vec2(-1, -1), vec2(+1, -1), // TR, BL, BR
        ].flat());

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(this.#program, 'aPosition');
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        // Done, unbind for now
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
     * Draws this square.
     */
    draw() {
        const gl = this.#gl;
        const { uPosition, uScale, uRotation, uColor } = this.#uLocations;

        gl.useProgram(this.#program);
        gl.bindVertexArray(this.#vao);

        gl.uniform2fv(uPosition, this.position);
        gl.uniform2fv(uScale, this.scale);
        gl.uniform1f(uRotation, this.rotation);
        gl.uniform4fv(uColor, this.color);

        gl.drawArrays(gl.TRIANGLES, 0, 6); // 2 triangles = 6 vertices

        gl.bindVertexArray(null);
        gl.useProgram(null);
    }
}
