// Chair.js
import { SceneObject } from './SceneObject.js';

export class Chair extends SceneObject {
    constructor(gl) {
        super();
        this.gl = gl;
        this.initChair();
        this.position = [0.0, 0.0, 0.0];
        this.rotation = [0, 0, 0];
    }

    initChair() {
        this.chairVertices = new Float32Array([
            // Seat (dark metallic gray)
            -0.5, 0.5, -0.5, 0.3, 0.3, 0.3,
             0.5, 0.5, -0.5, 0.3, 0.3, 0.3,
             0.5, 0.6, -0.5, 0.3, 0.3, 0.3,
            -0.5, 0.5, -0.5, 0.3, 0.3, 0.3,
             0.5, 0.6, -0.5, 0.3, 0.3, 0.3,
            -0.5, 0.6, -0.5, 0.3, 0.3, 0.3,
            -0.5, 0.5, 0.5, 0.3, 0.3, 0.3,
             0.5, 0.5, 0.5, 0.3, 0.3, 0.3,
             0.5, 0.6, 0.5, 0.3, 0.3, 0.3,
            -0.5, 0.5, 0.5, 0.3, 0.3, 0.3,
             0.5, 0.6, 0.5, 0.3, 0.3, 0.3,
            -0.5, 0.6, 0.5, 0.3, 0.3, 0.3,
            -0.5, 0.5, -0.5, 0.4, 0.4, 0.4,
            -0.5, 0.5, 0.5, 0.4, 0.4, 0.4,
            -0.5, 0.6, 0.5, 0.4, 0.4, 0.4,
            -0.5, 0.5, -0.5, 0.4, 0.4, 0.4,
            -0.5, 0.6, 0.5, 0.4, 0.4, 0.4,
            -0.5, 0.6, -0.5, 0.4, 0.4, 0.4,
             0.5, 0.5, -0.5, 0.4, 0.4, 0.4,
             0.5, 0.5, 0.5, 0.4, 0.4, 0.4,
             0.5, 0.6, 0.5, 0.4, 0.4, 0.4,
             0.5, 0.5, -0.5, 0.4, 0.4, 0.4,
             0.5, 0.6, 0.5, 0.4, 0.4, 0.4,
             0.5, 0.6, -0.5, 0.4, 0.4, 0.4,
            -0.5, 0.6, -0.5, 0.6, 0.6, 0.6,
             0.5, 0.6, -0.5, 0.6, 0.6, 0.6,
             0.5, 0.6, 0.5, 0.6, 0.6, 0.6,
            -0.5, 0.6, -0.5, 0.6, 0.6, 0.6,
             0.5, 0.6, 0.5, 0.6, 0.6, 0.6,
            -0.5, 0.6, 0.5, 0.6, 0.6, 0.6,
            -0.5, 0.5, -0.5, 0.2, 0.2, 0.2,
             0.5, 0.5, -0.5, 0.2, 0.2, 0.2,
             0.5, 0.5, 0.5, 0.2, 0.2, 0.2,
            -0.5, 0.5, -0.5, 0.2, 0.2, 0.2,
             0.5, 0.5, 0.5, 0.2, 0.2, 0.2,
            -0.5, 0.5, 0.5, 0.2, 0.2, 0.2,

            // Backrest
            -0.4, 0.6, 0.4, 0.75, 0.75, 0.75,
             0.4, 0.6, 0.4, 0.75, 0.75, 0.75,
             0.4, 1.5, 0.4, 0.75, 0.75, 0.75,
            -0.4, 0.6, 0.4, 0.75, 0.75, 0.75,
             0.4, 1.5, 0.4, 0.75, 0.75, 0.75,
            -0.4, 1.5, 0.4, 0.75, 0.75, 0.75,
            -0.4, 0.6, 0.5, 0.65, 0.65, 0.65,
             0.4, 0.6, 0.5, 0.65, 0.65, 0.65,
             0.4, 1.5, 0.5, 0.65, 0.65, 0.65,
            -0.4, 0.6, 0.5, 0.65, 0.65, 0.65,
             0.4, 1.5, 0.5, 0.65, 0.65, 0.65,
            -0.4, 1.5, 0.5, 0.65, 0.65, 0.65,

            // Legs
            // Front-left leg
            -0.45, 0.0, -0.45, 0.3, 0.3, 0.3,
            -0.35, 0.0, -0.45, 0.3, 0.3, 0.3,
            -0.35, 0.5, -0.45, 0.3, 0.3, 0.3,
            -0.45, 0.0, -0.45, 0.3, 0.3, 0.3,
            -0.35, 0.5, -0.45, 0.3, 0.3, 0.3,
            -0.45, 0.5, -0.45, 0.3, 0.3, 0.3,

            // Back-left leg
            -0.45, 0.0, 0.45, 0.3, 0.3, 0.3,
            -0.35, 0.0, 0.45, 0.3, 0.3, 0.3,
            -0.35, 0.5, 0.45, 0.3, 0.3, 0.3,
            -0.45, 0.0, 0.45, 0.3, 0.3, 0.3,
            -0.35, 0.5, 0.45, 0.3, 0.3, 0.3,
            -0.45, 0.5, 0.45, 0.3, 0.3, 0.3,

            // Front-right leg
             0.45, 0.0, -0.45, 0.3, 0.3, 0.3,
             0.35, 0.0, -0.45, 0.3, 0.3, 0.3,
             0.35, 0.5, -0.45, 0.3, 0.3, 0.3,
             0.45, 0.0, -0.45, 0.3, 0.3, 0.3,
             0.35, 0.5, -0.45, 0.3, 0.3, 0.3,
             0.45, 0.5, -0.45, 0.3, 0.3, 0.3,

            // Back-right leg
             0.45, 0.0, 0.45, 0.3, 0.3, 0.3,
             0.35, 0.0, 0.45, 0.3, 0.3, 0.3,
             0.35, 0.5, 0.45, 0.3, 0.3, 0.3,
             0.45, 0.0, 0.45, 0.3, 0.3, 0.3,
             0.35, 0.5, 0.45, 0.3, 0.3, 0.3,
             0.45, 0.5, 0.45, 0.3, 0.3, 0.3
        ]);

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.chairVertices, this.gl.STATIC_DRAW);
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

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.chairVertices.length / 6);

        this.children.forEach(child => {
            child.draw(program, viewMatrix, projectionMatrix);
        });
    }

    update(timestamp) {
        super.update(timestamp);
    }
}
