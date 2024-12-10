export class SceneObject {
  constructor() {
    this.children = [];
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.modelMatrix = mat4.create();
    this.color = [1.0, 1.0, 1.0, 1.0]; // Default color: white

    // Define vertex data for a cube (simple 3D object)
    this.vertexData = new Float32Array([
      // Front face
      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
      // Back face
      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
    ]);

    // Define indices for cube faces
    this.indices = new Uint16Array([
      0,
      1,
      2,
      2,
      3,
      0, // Front face
      4,
      5,
      6,
      6,
      7,
      4, // Back face
      0,
      4,
      7,
      7,
      3,
      0, // Left face
      1,
      5,
      6,
      6,
      2,
      1, // Right face
      3,
      7,
      6,
      6,
      2,
      3, // Top face
      0,
      4,
      5,
      5,
      1,
      0, // Bottom face
    ]);

    this.vertexBuffer = null;
    this.indexBuffer = null;
  }

  initializeBuffers(gl) {
    // Create a buffer for vertex positions
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

    // Create a buffer for indices
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  }

  updateModelMatrix(parentMatrix = mat4.create()) {
    const transformMatrix = mat4.create();
    mat4.translate(transformMatrix, transformMatrix, this.position);
    mat4.rotateX(transformMatrix, transformMatrix, this.rotation[0]);
    mat4.rotateY(transformMatrix, transformMatrix, this.rotation[1]);
    mat4.rotateZ(transformMatrix, transformMatrix, this.rotation[2]);
    mat4.scale(transformMatrix, transformMatrix, this.scale);
    mat4.multiply(this.modelMatrix, parentMatrix, transformMatrix);

    for (const child of this.children) {
      child.updateModelMatrix(this.modelMatrix);
    }
  }

  render(gl, parentMatrix, uModelViewMatrix, uProjectionMatrix, uColor) {
    if (!this.vertexBuffer || !this.indexBuffer) {
      this.initializeBuffers(gl);
    }

    this.updateModelMatrix(parentMatrix);

    // Pass the model-view matrix
    gl.uniformMatrix4fv(uModelViewMatrix, false, this.modelMatrix);

    // Set object color
    gl.uniform4f(uColor, ...this.color);

    // Bind buffers and draw the object
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    // Render children
    for (const child of this.children) {
      child.render(
        gl,
        this.modelMatrix,
        uModelViewMatrix,
        uProjectionMatrix,
        uColor
      );
    }
  }
}
