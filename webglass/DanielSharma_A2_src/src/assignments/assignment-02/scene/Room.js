// Room.js

import { SceneObject } from "./SceneObject.js";
import { Bed } from "./Bed.js";
import { Nightstand } from "./Nightstand.js";
import { Lamp } from "./Lamp.js";
import { Window } from "./Window.js";
import { Rug } from "./Rug.js";

export class Room extends SceneObject {
  constructor(gl) {
    super();
    this.gl = gl;
    this.initRoom();

    this.initializeRoomElements(gl);
  }

  initializeRoomElements(gl) {
    // Bed
    this.bed = new Bed(gl);
    this.bed.position = [2.99, -1.1, 0.0];
    this.bed.rotation = [0, Math.PI / 2, 0];
    // this.bed.rotation = [0.0, 1.5, 0.0];

    this.addChild(this.bed);

    // Left nightstand and lamp
    this.nightstandLeft = new Nightstand(gl);
    this.nightstandLeft.position = [4.5, -1.1, 2.0];
    this.lampLeft = new Lamp(gl);
    this.lampLeft.position = [0, 0.5, 0];
    this.nightstandLeft.addChild(this.lampLeft);
    this.addChild(this.nightstandLeft);

    // Right nightstand and lamp
    this.nightstandRight = new Nightstand(gl);
    this.nightstandRight.position = [4.5, -1.1, -2.0];
    this.lampRight = new Lamp(gl);
    this.lampRight.position = [0, 0.5, 0];
    this.nightstandRight.addChild(this.lampRight);
    this.addChild(this.nightstandRight);

    // Window
    this.window = new Window(gl);
    this.window.position = [0.0, 1.5, 0];
    this.addChild(this.window);

    // Rug
    this.rug = new Rug(gl);
    this.rug.position = [-1.0, 0.1, 0.0];
    this.addChild(this.rug);
  }

  initRoom() {
    // Room vertices for walls and floor
    this.wallVertices = new Float32Array([
      // Floor (white)
      -5.0, -1.1, -5.0, 1.0, 1.0, 1.0, 5.0, -1.1, -5.0, 1.0, 1.0, 1.0, 5.0,
      -1.1, 5.0, 1.0, 1.0, 1.0, -5.0, -1.1, -5.0, 1.0, 1.0, 1.0, 5.0, -1.1, 5.0,
      1.0, 1.0, 1.0, -5.0, -1.1, 5.0, 1.0, 1.0, 1.0,

      // Floor surface
      -5.0, -1.0, -5.0, 1.0, 1.0, 1.0, 5.0, -1.0, -5.0, 1.0, 1.0, 1.0, 5.0,
      -1.0, 5.0, 1.0, 1.0, 1.0, -5.0, -1.0, -5.0, 1.0, 1.0, 1.0, 5.0, -1.0, 5.0,
      1.0, 1.0, 1.0, -5.0, -1.0, 5.0, 1.0, 1.0, 1.0,

      // Back wall (beige)
      -5.1, -1.0, 5.0, 0.98, 0.82, 0.53, 5.1, -1.0, 5.0, 0.98, 0.82, 0.53, 5.1,
      5.0, 5.0, 0.98, 0.82, 0.53, -5.1, -1.0, 5.0, 0.98, 0.82, 0.53, 5.1, 5.0,
      5.0, 0.98, 0.82, 0.53, -5.1, 5.0, 5.0, 0.98, 0.82, 0.53,

      // Side wall (beige)
      5.0, -1.0, -5.1, 0.98, 0.82, 0.53, 5.0, -1.0, 5.1, 0.98, 0.82, 0.53, 5.0,
      5.0, 5.1, 0.98, 0.82, 0.53, 5.0, -1.0, -5.1, 0.98, 0.82, 0.53, 5.0, 5.0,
      5.1, 0.98, 0.82, 0.53, 5.0, 5.0, -5.1, 0.98, 0.82, 0.53,
    ]);

    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.wallVertices,
      this.gl.STATIC_DRAW
    );
  }

  draw(program, viewMatrix, projectionMatrix) {
    const modelMatrix = this.getModelMatrix();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    const aPosition = this.gl.getAttribLocation(program, "aPosition");
    const aColor = this.gl.getAttribLocation(program, "aColor");

    const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
    this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, stride, 0);
    this.gl.enableVertexAttribArray(aPosition);

    this.gl.vertexAttribPointer(
      aColor,
      3,
      this.gl.FLOAT,
      false,
      stride,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
    this.gl.enableVertexAttribArray(aColor);

    const uModelMatrix = this.gl.getUniformLocation(program, "uModelMatrix");
    const uViewMatrix = this.gl.getUniformLocation(program, "uViewMatrix");
    const uProjectionMatrix = this.gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );

    this.gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
    this.gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
    this.gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    // Draw room walls and floor
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.wallVertices.length / 6);

    // Draw all children (furniture and other elements)
    this.children.forEach((child) => {
      child.draw(program, viewMatrix, projectionMatrix);
    });
  }

  update(timestamp) {
    this.updateModelMatrix();
    this.children.forEach((child) => {
      child.update(timestamp);
    });
  }
}
