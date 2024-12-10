// Camera.js
import { SceneObject } from '../scene/SceneObject.js';

export class Camera extends SceneObject {
    constructor(position, target, up, fov = 45, aspect = 1, near = 0.1, far = 100) {
        super(); // Call SceneObject constructor

        // Set initial position, target, and up vector
        this.position = [...position];
        this.target = [...target];
        this.up = [...up];

        // Camera-specific properties
        this.fov = fov;                 // Field of view in degrees
        this.aspect = aspect;           // Aspect ratio (width / height)
        this.near = near;               // Near clipping plane
        this.far = far;                 // Far clipping plane

        // Initialize view and projection matrices
        this.viewMatrix = this.computeViewMatrix();
        this.projectionMatrix = this.computeProjectionMatrix();
    }

    // Compute the view matrix based on position, target, and up vector
    computeViewMatrix() {
        const zAxis = this.normalize([
            this.position[0] - this.target[0],
            this.position[1] - this.target[1],
            this.position[2] - this.target[2]
        ]);
        const xAxis = this.normalize(this.cross(this.up, zAxis));
        const yAxis = this.cross(zAxis, xAxis);

        return [
            xAxis[0], yAxis[0], zAxis[0], 0,
            xAxis[1], yAxis[1], zAxis[1], 0,
            xAxis[2], yAxis[2], zAxis[2], 0,
            -this.dot(xAxis, this.position),
            -this.dot(yAxis, this.position),
            -this.dot(zAxis, this.position), 1
        ];
    }

    // Compute the projection matrix using perspective parameters
    computeProjectionMatrix() {
        const f = 1.0 / Math.tan((this.fov * Math.PI) / 360);
        const rangeInv = 1.0 / (this.near - this.far);

        return [
            f / this.aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (this.near + this.far) * rangeInv, -1,
            0, 0, this.near * this.far * rangeInv * 2, 0
        ];
    }

    // Update the position of the camera and recalculate the view matrix
    updatePosition(x, y, z) {
        this.position = [x, y, z];
        this.viewMatrix = this.computeViewMatrix();
    }

    // Getter for view matrix
    getViewMatrix() {
        return this.viewMatrix;
    }

    // Getter for projection matrix
    getProjectionMatrix() {
        return this.projectionMatrix;
    }

    // Helper functions for vector operations
    normalize(v) {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return length > 0 ? [v[0] / length, v[1] / length, v[2] / length] : [0, 0, 0];
    }

    cross(v1, v2) {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    }

    dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }
}
