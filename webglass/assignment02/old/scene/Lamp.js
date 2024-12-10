// Lamp.js
import { SceneObject } from './SceneObject.js';

export class Lamp extends SceneObject {
    constructor(gl) {
        super(gl);
        this.initLamp();
    }

    initLamp() {
        const segments = 20; // Number of segments for a rounded look

        // Vertices array to hold all vertices for the lamp
        const vertices = [];

        // Base of the lamp (cylinder with dark gray color)
        this.addCylinder(vertices, 0.5, 0.1, [0.2, 0.2, 0.2], segments);

        // Shorter stem of the lamp (cylinder with light gray color)
        this.addCylinder(vertices, 0.1, 0.5, [0.7, 0.7, 0.7], segments, 0.1);

        // Larger cube for the lampshade (yellowish color)
        this.addCube(vertices, 0.8, [1.0, 1.0, 0.8], 0.6);

        this.vertices = new Float32Array(vertices);

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
    }

    addCylinder(vertices, radius, height, color, segments, yOffset = 0) {
        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * 2 * Math.PI;
            const nextTheta = ((i + 1) / segments) * 2 * Math.PI;

            // Bottom circle
            vertices.push(
                radius * Math.cos(theta), yOffset, radius * Math.sin(theta), ...color,
                radius * Math.cos(nextTheta), yOffset, radius * Math.sin(nextTheta), ...color,
                0, yOffset, 0, ...color
            );

            // Top circle
            vertices.push(
                radius * Math.cos(theta), yOffset + height, radius * Math.sin(theta), ...color,
                radius * Math.cos(nextTheta), yOffset + height, radius * Math.sin(nextTheta), ...color,
                0, yOffset + height, 0, ...color
            );

            // Side faces
            vertices.push(
                radius * Math.cos(theta), yOffset, radius * Math.sin(theta), ...color,
                radius * Math.cos(nextTheta), yOffset, radius * Math.sin(nextTheta), ...color,
                radius * Math.cos(nextTheta), yOffset + height, radius * Math.sin(nextTheta), ...color,
                radius * Math.cos(theta), yOffset, radius * Math.sin(theta), ...color,
                radius * Math.cos(theta), yOffset + height, radius * Math.sin(theta), ...color,
                radius * Math.cos(nextTheta), yOffset + height, radius * Math.sin(nextTheta), ...color
            );
        }
    }

    addCube(vertices, size, color, yOffset = 0) {
        // Define vertices for a cube centered at (0, yOffset, 0)
        const half = size / 2;
        const positions = [
            // Front face
            -half, yOffset, -half,  half, yOffset, -half,  half, yOffset + size, -half,
            -half, yOffset, -half,  half, yOffset + size, -half, -half, yOffset + size, -half,
            
            // Back face
            -half, yOffset, half,  half, yOffset, half,  half, yOffset + size, half,
            -half, yOffset, half,  half, yOffset + size, half, -half, yOffset + size, half,

            // Left face
            -half, yOffset, -half,  -half, yOffset, half,  -half, yOffset + size, half,
            -half, yOffset, -half,  -half, yOffset + size, half, -half, yOffset + size, -half,

            // Right face
            half, yOffset, -half,  half, yOffset, half,  half, yOffset + size, half,
            half, yOffset, -half,  half, yOffset + size, half, half, yOffset + size, -half,

            // Top face
            -half, yOffset + size, -half,  half, yOffset + size, -half,  half, yOffset + size, half,
            -half, yOffset + size, -half,  half, yOffset + size, half, -half, yOffset + size, half,

            // Bottom face
            -half, yOffset, -half,  half, yOffset, -half,  half, yOffset, half,
            -half, yOffset, -half,  half, yOffset, half, -half, yOffset, half,
        ];

        // Push positions and color data
        for (let i = 0; i < positions.length; i += 3) {
            vertices.push(positions[i], positions[i + 1], positions[i + 2], ...color);
        }
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

        this.children.forEach(child => {
            child.draw(program, viewMatrix, projectionMatrix, modelMatrix);
        });
    }
}
