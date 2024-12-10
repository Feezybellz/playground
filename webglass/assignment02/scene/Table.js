// Table.js
import { SceneObject } from './SceneObject.js';

export class Table extends SceneObject {
    constructor(gl) {
        super();
        this.gl = gl;
        this.initTable();
        this.position = [0, 0, 0];   // Initial position of the table
        this.rotation = [0, 0, 0];   // Initial rotation of the table
    }

    initTable() {
        this.tableVertices = new Float32Array([
            // Table top (vibrant colors for visibility)
            // Front face (bright pink)
            -1.0, 0.9, -1.0, 1.0, 0.0, 0.8,
             1.0, 0.9, -1.0, 1.0, 0.0, 0.8,
             1.0, 1.0, -1.0, 1.0, 0.0, 0.8,
            -1.0, 0.9, -1.0, 1.0, 0.0, 0.8,
             1.0, 1.0, -1.0, 1.0, 0.0, 0.8,
            -1.0, 1.0, -1.0, 1.0, 0.0, 0.8,

            // Back face (bright yellow)
            -1.0, 0.9, 1.0, 1.0, 1.0, 0.0,
             1.0, 0.9, 1.0, 1.0, 1.0, 0.0,
             1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            -1.0, 0.9, 1.0, 1.0, 1.0, 0.0,
             1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            -1.0, 1.0, 1.0, 1.0, 1.0, 0.0,

            // Left face (teal)
            -1.0, 0.9, -1.0, 0.0, 1.0, 0.8,
            -1.0, 0.9, 1.0, 0.0, 1.0, 0.8,
            -1.0, 1.0, 1.0, 0.0, 1.0, 0.8,
            -1.0, 0.9, -1.0, 0.0, 1.0, 0.8,
            -1.0, 1.0, 1.0, 0.0, 1.0, 0.8,
            -1.0, 1.0, -1.0, 0.0, 1.0, 0.8,

            // Right face (bright green)
             1.0, 0.9, -1.0, 0.0, 1.0, 0.0,
             1.0, 0.9, 1.0, 0.0, 1.0, 0.0,
             1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
             1.0, 0.9, -1.0, 0.0, 1.0, 0.0,
             1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
             1.0, 1.0, -1.0, 0.0, 1.0, 0.0,

            // Top face (purple)
            -1.0, 1.0, -1.0, 0.5, 0.0, 0.5,
             1.0, 1.0, -1.0, 0.5, 0.0, 0.5,
             1.0, 1.0, 1.0, 0.5, 0.0, 0.5,
            -1.0, 1.0, -1.0, 0.5, 0.0, 0.5,
             1.0, 1.0, 1.0, 0.5, 0.0, 0.5,
            -1.0, 1.0, 1.0, 0.5, 0.0, 0.5,

            // Bottom face (orange)
            -1.0, 0.9, -1.0, 1.0, 0.5, 0.0,
             1.0, 0.9, -1.0, 1.0, 0.5, 0.0,
             1.0, 0.9, 1.0, 1.0, 0.5, 0.0,
            -1.0, 0.9, -1.0, 1.0, 0.5, 0.0,
             1.0, 0.9, 1.0, 1.0, 0.5, 0.0,
            -1.0, 0.9, 1.0, 1.0, 0.5, 0.0,

            // Legs (distinct colors)
            // Front-left leg (red)
            -0.9, 0.0, -0.9, 1.0, 0.0, 0.0,
            -0.8, 0.0, -0.9, 1.0, 0.0, 0.0,
            -0.8, 0.9, -0.9, 1.0, 0.0, 0.0,
            -0.9, 0.0, -0.9, 1.0, 0.0, 0.0,
            -0.8, 0.9, -0.9, 1.0, 0.0, 0.0,
            -0.9, 0.9, -0.9, 1.0, 0.0, 0.0,

            // Back-left leg (blue)
            -0.9, 0.0, 0.9, 0.0, 0.0, 1.0,
            -0.8, 0.0, 0.9, 0.0, 0.0, 1.0,
            -0.8, 0.9, 0.9, 0.0, 0.0, 1.0,
            -0.9, 0.0, 0.9, 0.0, 0.0, 1.0,
            -0.8, 0.9, 0.9, 0.0, 0.0, 1.0,
            -0.9, 0.9, 0.9, 0.0, 0.0, 1.0,

            // Front-right leg (cyan)
             0.8, 0.0, -0.9, 0.0, 1.0, 1.0,
             0.9, 0.0, -0.9, 0.0, 1.0, 1.0,
             0.9, 0.9, -0.9, 0.0, 1.0, 1.0,
             0.8, 0.0, -0.9, 0.0, 1.0, 1.0,
             0.9, 0.9, -0.9, 0.0, 1.0, 1.0,
             0.8, 0.9, -0.9, 0.0, 1.0, 1.0,

            // Back-right leg (lime green)
             0.8, 0.0, 0.9, 0.5, 1.0, 0.0,
             0.9, 0.0, 0.9, 0.5, 1.0, 0.0,
             0.9, 0.9, 0.9, 0.5, 1.0, 0.0,
             0.8, 0.0, 0.9, 0.5, 1.0, 0.0,
             0.9, 0.9, 0.9, 0.5, 1.0, 0.0,
             0.8, 0.9, 0.9, 0.5, 1.0, 0.0
        ]);

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.tableVertices, this.gl.STATIC_DRAW);
    }

    draw(program, viewMatrix, projectionMatrix) {
        const modelMatrix = this.getModelMatrix();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        const aPosition = this.gl.getAttribLocation(program, 'aPosition');
        const aColor = this.gl.getAttribLocation(program, 'aColor');

        const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
        this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, stride, 0);
        this.gl.enableVertexAttribArray(aPosition);

        this.gl.vertexAttribPointer(aColor, 3, this.gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(aColor);

        const uModelMatrix = this.gl.getUniformLocation(program, 'uModelMatrix');
        const uViewMatrix = this.gl.getUniformLocation(program, 'uViewMatrix');
        const uProjectionMatrix = this.gl.getUniformLocation(program, 'uProjectionMatrix');

        this.gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
        this.gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
        this.gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

        // Draw the table top and legs
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.tableVertices.length / 6);

        this.children.forEach(child => {
            child.draw(program, viewMatrix, projectionMatrix);
        });
    }

    update(timestamp) {
        super.update(timestamp);
    }
}
