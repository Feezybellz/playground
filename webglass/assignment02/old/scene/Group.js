// Group.js
import { SceneObject } from "./SceneObject.js";

export class Group extends SceneObject {
  constructor(gl) {
    super();
    this.gl = gl;
    this.position = [0, 0, 0]; // Initial position of the group
    this.rotation = [0, 0, 0]; // Initial rotation of the group
    this.scale = [1, 1, 1]; // Initial scale of the group
  }

  // Override draw to apply the group's transformations to its children
  // draw(program, viewMatrix, projectionMatrix) {
  //     // Calculate the model matrix for the group itself
  //     const modelMatrix = this.getModelMatrix();

  //     // Draw all children with the group's model matrix applied
  //     this.children.forEach(child => {
  //         child.draw(program, viewMatrix, projectionMatrix, modelMatrix);
  //     });
  // }
  draw(program, viewMatrix, projectionMatrix, parentModelMatrix = null) {
    // Calculate this group's model matrix
    const modelMatrix = this.getModelMatrix();

    // Combine this model matrix with the parent's (if any)
    const finalModelMatrix = parentModelMatrix
      ? mat4.multiply(mat4.create(), parentModelMatrix, modelMatrix)
      : modelMatrix;

    // Draw all children using the combined model matrix
    this.children.forEach((child) => {
      child.draw(program, viewMatrix, projectionMatrix, finalModelMatrix);
    });
  }

  update(timestamp) {
    super.update(timestamp); // Update all children recursively if necessary
  }
}
