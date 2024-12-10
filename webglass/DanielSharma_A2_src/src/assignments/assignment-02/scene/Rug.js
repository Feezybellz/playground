// Rug.js
import { SceneObject } from './SceneObject.js';

export class Rug extends SceneObject {
    constructor(gl) {
        super(gl);
        this.initRug();
    }

    initRug() {
        const rugColor = [0.8, 0.5, 0.3]; // Warm brownish color

        this.vertices = new Float32Array([
            // Rug vertices
            -1.0, -1.09, -2.0, ...rugColor,
             1.0, -1.09, -2.0, ...rugColor,
             1.0, -1.09,  2.0, ...rugColor,
            -1.0, -1.09, -2.0, ...rugColor,
             1.0, -1.09,  2.0, ...rugColor,
            -1.0, -1.09,  2.0, ...rugColor
        ]);

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
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

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 6);
    }
}
