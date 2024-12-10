import { SceneObject } from "./SceneObject.js";
import { mat4 } from "../Utils/mat4.js";

export class Group extends SceneObject {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    this.children = [];
  }

  // Add a child to the group and set its parent to this group
  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  // Set the position of the group
  setPosition(x, y, z) {
    this.position = [x, y, z];
    this.updateModelMatrix(); // Update the model matrix whenever the position changes
  }

  // Set the rotation of the group
  setRotation(x, y, z) {
    this.rotation = [x, y, z];
    this.updateModelMatrix(); // Update the model matrix whenever the rotation changes
  }

  // Update the model matrix to include the group's position, rotation, and scale
  updateModelMatrix() {
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
  }

  // Override the draw method to apply the group's transformations to its children
  draw(program, viewMatrix, projectionMatrix, parentMatrix = null) {
    // Update this group's model matrix
    this.updateModelMatrix();

    // Calculate the combined matrix by multiplying the parent's matrix with this group's matrix
    const combinedMatrix = mat4.create();
    if (parentMatrix) {
      mat4.multiply(combinedMatrix, parentMatrix, this.modelMatrix);
    } else {
      mat4.copy(combinedMatrix, this.modelMatrix);
    }

    // Draw each child with the combined matrix as the new parent matrix
    this.children.forEach((child) => {
      child.draw(program, viewMatrix, projectionMatrix, combinedMatrix);
    });
  }
}

// // Group.js
// import { SceneObject } from "./SceneObject.js";

// export class Group extends SceneObject {
//   constructor(gl) {
//     super();
//     this.gl = gl;
//   }

//   updateModelMatrix() {
//     // Update the group's model matrix
//     mat4.identity(this.modelMatrix);
//     mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
//     mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
//     mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
//     mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
//     mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

//     // Apply the parent transformation (if any)
//     if (this.parent) {
//       mat4.multiply(
//         this.modelMatrix,
//         this.parent.modelMatrix,
//         this.modelMatrix
//       );
//     }

//     // Update children's model matrices relative to this group's model matrix
//     this.children.forEach((child) => {
//       child.update();
//       // child.children.forEach((child) => {
//       //   child.update(timestamp);
//       // });
//     });
//   }

//   draw(program, viewMatrix, projectionMatrix) {
//     this.children.forEach((child) => {
//       child.draw(program, viewMatrix, projectionMatrix);
//     });
//   }
// }
