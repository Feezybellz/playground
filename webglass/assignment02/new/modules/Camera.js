import { SceneObject } from "./SceneObject.js";

export class Camera extends SceneObject {
  constructor(gl, fov = 45, near = 0.1, far = 100) {
    super();
    this.fov = fov; // Field of view in degrees
    this.near = near; // Near clipping plane
    this.far = far; // Far clipping plane
    this.aspectRatio = gl.canvas.width / gl.canvas.height; // Canvas aspect ratio
    this.projectionMatrix = mat4.create();
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    mat4.perspective(
      this.projectionMatrix,
      (this.fov * Math.PI) / 180, // Convert degrees to radians
      this.aspectRatio,
      this.near,
      this.far
    );
  }

  getViewMatrix() {
    const viewMatrix = mat4.create();
    mat4.invert(viewMatrix, this.modelMatrix); // View matrix is the inverse of the model matrix
    return viewMatrix;
  }

  resize(gl) {
    this.aspectRatio = gl.canvas.width / gl.canvas.height;
    this.updateProjectionMatrix();
  }
}
