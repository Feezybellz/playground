import { SceneObject } from "./SceneObject.js";

export class Rug extends SceneObject {
  constructor(gl, shaderProgram) {
    super(gl, shaderProgram);
    this.initBuffers();
  }

  initBuffers() {
    const vertices = new Float32Array([
      -2.5, 0.0, 2.5, 2.5, 0.0, 2.5, 2.5, 0.0, -2.5, -2.5, 0.0, -2.5,
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

    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.shaderProgram, "uModelMatrix"),
      false,
      this.modelMatrix
    );
    this.gl.uniform4f(
      this.gl.getUniformLocation(this.shaderProgram, "uColor"),
      0.7,
      0.3,
      0.3,
      1.0
    ); // Rug color

    // Call drawArrays with the required 3 arguments: mode, first, and count
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertexCount);
  }
}
