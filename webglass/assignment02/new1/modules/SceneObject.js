// import { mat4 } from "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix.min.js";

export class SceneObject {
  constructor(gl, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.modelMatrix = mat4.create();
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0]; // Rotation in degrees for x, y, and z axes
    this.scale = [1, 1, 1]; // Scale in x, y, and z directions
  }

  // Sets absolute position
  setPosition(x, y, z) {
    this.position = [x, y, z];
    this.updateModelMatrix();
  }

  // Sets absolute rotation in degrees
  setRotation(x, y, z) {
    this.rotation = [x, y, z];
    this.updateModelMatrix();
  }

  // Sets absolute scale
  setScale(x, y, z) {
    this.scale = [x, y, z];
    this.updateModelMatrix();
  }

  // Updates the model matrix based on position, rotation, and scale
  updateModelMatrix() {
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotateX(
      this.modelMatrix,
      this.modelMatrix,
      (this.rotation[0] * Math.PI) / 180
    );
    mat4.rotateY(
      this.modelMatrix,
      this.modelMatrix,
      (this.rotation[1] * Math.PI) / 180
    );
    mat4.rotateZ(
      this.modelMatrix,
      this.modelMatrix,
      (this.rotation[2] * Math.PI) / 180
    );
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
  }

  // Sets up the WebGL buffers and uniforms, overridden in subclasses
  draw() {
    // This is a placeholder for subclasses to implement specific draw logic.
    // Each subclass should set up its vertex buffer, bind attributes, and set uniforms.
  }
}
