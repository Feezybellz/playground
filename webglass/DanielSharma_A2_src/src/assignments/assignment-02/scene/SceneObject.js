import { mat4 } from "../Utils/mat4.js";

export class SceneObject {
  constructor(gl = null, vertices = null) {
    this.gl = gl; // WebGL context, optional
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.modelMatrix = mat4.create();
    this.children = [];
    this.bounds = null; // Initialize bounds
  }

  // Get the position of the group
  getPosition() {
    return this.position;
  }
  getRotation() {
    return this.rotation;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  updateModelMatrix() {
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

    // Apply parent's transformation
    if (this.parent) {
      mat4.multiply(
        this.modelMatrix,
        this.parent.modelMatrix,
        this.modelMatrix
      );
    }

    // Update children's model matrices relative to this group's model matrix
    this.children.forEach((child) => {
      child.updateModelMatrix(); // Recursively update each child's model matrix
    });
    this.calculateBounds();
  }

  getModelMatrix() {
    return this.modelMatrix;
  }

  setPosition(x, y, z) {
    this.position = [x, y, z];
    this.updateModelMatrix(); // Update model matrix when position changes
  }

  setRotation(x, y, z) {
    this.rotation = [x, y, z];
    this.updateModelMatrix(); // Update model matrix when rotation changes
  }

  setScale(x, y, z) {
    this.scale = [x, y, z];
    this.updateModelMatrix(); // Update model matrix when scale changes
  }

  calculateBounds() {
    // Simple example: assuming object spans -1 to +1 in each axis
    const scaleX = this.scale[0];
    const scaleY = this.scale[1];
    const scaleZ = this.scale[2];

    const centerX = this.position[0];
    const centerY = this.position[1];
    const centerZ = this.position[2];

    this.bounds = {
      minX: centerX - scaleX / 2,
      maxX: centerX + scaleX / 2,
      minY: centerY - scaleY / 2,
      maxY: centerY + scaleY / 2,
      minZ: centerZ - scaleZ / 2,
      maxZ: centerZ + scaleZ / 2,
    };
  }
  // Update the model matrix based on position, rotation, and scale
  updateModelMatrix() {
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

    // Apply parent's transformation if this object is part of a group
    if (this.parent) {
      mat4.multiply(
        this.modelMatrix,
        this.parent.modelMatrix,
        this.modelMatrix
      );
    }
  }

  draw(program, viewMatrix, projectionMatrix, parentMatrix = null) {
    // Update the model matrix
    this.updateModelMatrix();

    // Calculate the combined model matrix by combining parent's matrix with this object's model matrix
    const combinedMatrix = mat4.create();
    if (parentMatrix) {
      mat4.multiply(combinedMatrix, parentMatrix, this.modelMatrix);
    } else {
      mat4.copy(combinedMatrix, this.modelMatrix);
    }

    // Set the model matrix uniform in the shader
    const uModelMatrix = this.gl.getUniformLocation(program, "uModelMatrix");
    const uViewMatrix = this.gl.getUniformLocation(program, "uViewMatrix");
    const uProjectionMatrix = this.gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );

    this.gl.uniformMatrix4fv(uModelMatrix, false, combinedMatrix);
    this.gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
    this.gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    // Draw the object if it has vertices
    if (this.gl && this.vertices) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.vertexAttribPointer(
        this.gl.getAttribLocation(program, "aPosition"),
        3,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      this.gl.enableVertexAttribArray(
        this.gl.getAttribLocation(program, "aPosition")
      );

      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 3);
    }

    // Recursively draw each child with the combined model matrix
    this.children.forEach((child) => {
      child.draw(program, viewMatrix, projectionMatrix, combinedMatrix);
    });
  }

  update(timestamp) {
    this.updateModelMatrix();

    this.children.forEach((child) => {
      child.update(timestamp);
    });
  }
}
