import { SceneObject } from "./SceneObject.js";

export class Chair extends SceneObject {
  constructor(gl, shaderProgram) {
    super(gl, shaderProgram);
    this.initBuffers();
  }

  initBuffers() {
    const vertices = new Float32Array([
      // Define vertices for the chair shape here...
    ]);
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    this.vertexCount = vertices.length / 3; // Each vertex has 3 components (x, y, z)
  }

  draw() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(
      this.gl.getAttribLocation(this.shaderProgram, "aPosition"),
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(
      this.gl.getAttribLocation(this.shaderProgram, "aPosition")
    );

    // Set model matrix for positioning this object
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [1, 0, -2]); // Adjust position as needed
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.shaderProgram, "uModelMatrix"),
      false,
      modelMatrix
    );

    // Set color
    this.gl.uniform4f(
      this.gl.getUniformLocation(this.shaderProgram, "uColor"),
      0.3,
      0.2,
      0.1,
      1.0
    ); // Chair color

    // Draw the object
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertexCount);
  }
}
