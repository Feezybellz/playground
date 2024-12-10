import { SceneObject } from "./SceneObject.js";

export class Bed extends SceneObject {
  constructor(gl, shaderProgram) {
    super(gl, shaderProgram);
    this.initBuffers();
    this.setPosition(0, 0, -6); // Example position within view
  }

  initBuffers() {
    const vertices = new Float32Array([
      // Example vertices for a bed shape
      -1.5, 0.0, 0.5, 1.5, 0.0, 0.5, 1.5, 0.0, -0.5, -1.5, 0.0, -0.5,
    ]);
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    this.vertexCount = vertices.length / 3; // 3 components per vertex
  }

  draw() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    const aPosition = this.gl.getAttribLocation(
      this.shaderProgram,
      "aPosition"
    );
    this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(aPosition);

    const uModelMatrix = this.gl.getUniformLocation(
      this.shaderProgram,
      "uModelMatrix"
    );
    this.gl.uniformMatrix4fv(uModelMatrix, false, this.modelMatrix);

    const uColor = this.gl.getUniformLocation(this.shaderProgram, "uColor");
    this.gl.uniform4f(uColor, 0.6, 0.4, 0.3, 1.0); // Unique color for bed

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertexCount);
  }
}
