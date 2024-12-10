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
    this.recalculateBounds();
  }
  // Remove a child from the group and set its parent to null
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
      this.recalculateBounds();
    }
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

  // Recalculate the group's bounds based on its children
  recalculateBounds() {
    if (this.children.length === 0) {
      this.bounds = {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        minZ: 0,
        maxZ: 0,
      };
      return;
    }

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;

    this.children.forEach((child) => {
      const [x, y, z] = child.position;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    });

    this.bounds = { minX, maxX, minY, maxY, minZ, maxZ };
  }

  // Get the center of the group based on its bounds
  getCenter() {
    const centerX = (this.bounds.minX + this.bounds.maxX) / 2;
    const centerY = (this.bounds.minY + this.bounds.maxY) / 2;
    const centerZ = (this.bounds.minZ + this.bounds.maxZ) / 2;
    return [centerX, centerY, centerZ];
  }

  // Get the size of the group based on its bounds
  getSize() {
    const sizeX = this.bounds.maxX - this.bounds.minX;
    const sizeY = this.bounds.maxY - this.bounds.minY;
    const sizeZ = this.bounds.maxZ - this.bounds.minZ;
    return [sizeX, sizeY, sizeZ];
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
