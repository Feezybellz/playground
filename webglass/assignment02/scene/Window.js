// Window.js
import { SceneObject } from './SceneObject.js';

export class Window extends SceneObject {
    constructor(gl) {
        super(gl);
        this.initWindow();
    }

    initWindow() {
        const frameColor = [0.6, 0.6, 0.6]; // Light gray frame color
        const glassColor = [0.8, 0.9, 1.0]; // Light blue glass color

        // Increased size window (larger width and height)
        this.vertices = new Float32Array([ 
            // Outer frame vertices (larger rectangle)
            -1.0, 0.6, 4.9, ...frameColor, // Increased width
             1.0, 0.6, 4.9, ...frameColor, 
             1.0, 2.4, 4.9, ...frameColor, // Increased height
            -1.0, 0.6, 4.9, ...frameColor, 
             1.0, 2.4, 4.9, ...frameColor, 
            -1.0, 2.4, 4.9, ...frameColor,

            // Glass pane (back layer for transparency effect)
            -0.95, 0.65, 4.89, ...glassColor, // Increased width
             0.95, 0.65, 4.89, ...glassColor, 
             0.95, 2.35, 4.89, ...glassColor, // Increased height
            -0.95, 0.65, 4.89, ...glassColor, 
             0.95, 2.35, 4.89, ...glassColor, 
            -0.95, 2.35, 4.89, ...glassColor,

            // Horizontal crossbar
            -0.95, 1.3, 4.88, ...frameColor, 
             0.95, 1.3, 4.88, ...frameColor, 
             0.95, 1.35, 4.88, ...frameColor, 
            -0.95, 1.3, 4.88, ...frameColor, 
             0.95, 1.35, 4.88, ...frameColor, 
            -0.95, 1.35, 4.88, ...frameColor,

            // Vertical crossbar
            -0.05, 0.65, 4.88, ...frameColor, 
             0.05, 0.65, 4.88, ...frameColor, 
             0.05, 2.35, 4.88, ...frameColor, 
            -0.05, 0.65, 4.88, ...frameColor, 
             0.05, 2.35, 4.88, ...frameColor, 
            -0.05, 2.35, 4.88, ...frameColor
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
