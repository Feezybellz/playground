import { SceneObject } from "./SceneObject.js";

export class Table extends SceneObject {
  constructor(gl, shaderProgram) {
    super(gl, shaderProgram);
    this.initBuffers();
  }

  initBuffers() {
    // Define vertices for a basic table structure (e.g., top surface, legs)
    const vertices = new Float32Array([
      // Define vertices for the tabletop
      -1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 0.5, -0.5, -1.0, 0.5, -0.5,
      // Define vertices for table legs
      -0.9, 0.0, 0.4, -0.8, 0.5, 0.4, -0.8, 0.0, 0.4,
      // Add other legs similarly...
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
      0.5,
      0.3,
      0.2,
      1.0
    ); // Table color
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertexCount);
  }
}
