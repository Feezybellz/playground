// ---- !!! Lab solutions note !!! -----------------------------------------------------------------
// Just like the other classes provided in the lab solutions and sample code, this class is JUST AN
// EXAMPLE. You do **not** have to architect your WebGL applications in exactly this way.
// -------------------------------------------------------------------------------------------------

/**
 * @typedef VertexAttribute
 * @property {number} size The amount of {@linkcode type} elements within this attribute.
 * @property {GLenum} type Which datatype this attribute is made of (`gl.FLOAT`, `gl.INT`, etc.).
 * @property {number} stride How far apart, in **bytes,** each instance of this attribute is.
 * @property {number} offset How wide, in **bytes,** this attribute is in its final buffer.
 */

/**
 * A thin wrapper class that holds a buffer of vertex data and a VAO with their attributes.
 */
export class Mesh {
    gl;
    vao;

    vertexData;
    vertexBuffer;
    vertexAttributes;

    vertexCount;

    /**
     * @type {GLenum} Which of `gl.TRIANGLES`, `gl.TRIANGLE_STRIP`, etc., this object should use.
     * Defaults to `gl.TRIANGLES`.
     */
    drawingMode;

    /**
     * @param {WebGL2RenderingContext} gl The WebGL context within which this mesh should create its
     * buffers and VAOs.
     *
     * @param {ArrayBufferLike} vertexData A `Float32Array` or similar built-in "TypedArray"
     * containing raw vertex data.
     *
     * @param {number} vertexCount The number of vertices held within {@linkcode vertexData}.
     *
     * @param {VertexAttribute[]} attributes An array of {@link VertexAttribute} objects that
     * explains how the elements of {@link data} should be drawn. Order of this array is important;
     * the first one configures vertex attribute 0, the second vertex attribute 1, and so on.
     */
    constructor(gl, vertexData, vertexCount, attributes) {
        this.gl = gl;
        this.vertexData = vertexData;
        this.vertexCount = vertexCount;
        this.vertexAttributes = attributes;

        this.drawingMode = gl.TRIANGLES;

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

        for (let i = 0; i < attributes.length; i++) {
            gl.vertexAttribPointer(
                i,
                attributes[i].size,
                attributes[i].type,
                false,
                attributes[i].stride,
                attributes[i].offset,
            );
            gl.enableVertexAttribArray(i);
        }

        // Unbind our VAO to prevent outside code from accidentally modifying our vertex attributes.
        gl.bindVertexArray(null);
    }

    /**
     * Draws this mesh.
     */
    draw() {
        const gl = this.gl;

        gl.bindVertexArray(this.vao);
        gl.drawArrays(this.drawingMode, 0, this.vertexCount);

        // Unbind our VAO to prevent outside code from accidentally modifying our vertex attributes.
        gl.bindVertexArray(null);
    }
}
