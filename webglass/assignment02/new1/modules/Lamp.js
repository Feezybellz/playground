import { SceneObject } from "./SceneObject.js";

export class Lamp extends SceneObject {
  constructor(gl, shaderProgram) {
    super(gl, shaderProgram);
    this.initBuffers();
  }

  initBuffers() {
    const vertices = new Float32Array([
      // Lamp shade
      -0.5, 1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5,
      // Lamp base
      -0.2, 0.0, 0.2, 0.2, 0.0, 0.2, 0.2, 0.0, -0.2, -0.2, 0.0, -0.2,
    ]);
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
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
      1.0,
      1.0,
      0.0,
      1.0
    ); // Lamp color
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertexCount);
  }
}
