// Room.js
import { SceneObject } from "./SceneObject.js";
import { Group } from "./Group.js";
import { Chair } from "./Chair.js";
import { Table } from "./Table.js";
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

    // Create a group for chair and table
    this.furnitureGroup = new Group(gl);
    this.furnitureGroup.position = [0, 0, 0];

    // Initialize and add the chair to the group
    this.chair = new Chair(gl);
    this.chair.initialOffset = [3.5, -1.1, -2.5];
    this.chair.rotation = [0, Math.PI, 0];
    this.furnitureGroup.addChild(this.chair);

    // Initialize and add the table to the group
    this.table = new Table(gl);
    this.table.initialOffset = [3.5, -1.1, 3.5];
    this.table.rotation = [0, Math.PI / 2, 0];
    this.furnitureGroup.addChild(this.table);

    // Add the lamp to the table
    this.lamp = new Lamp(gl);
    this.lamp.position = [0, 0.5, 0]; // Relative to table
    this.table.addChild(this.lamp);

    // Add the group to the room
    this.addChild(this.furnitureGroup);

    // Initialize and add the bed
    this.bed = new Bed(gl);
    this.bed.position = [0.0, -1.1, 2.5];
    this.bed.rotation = [0, -Math.PI / 2, 0];
    this.addChild(this.bed);

    // Initialize the left nightstand and its lamp
    this.nightstandLeft = new Nightstand(gl);
    this.nightstandLeft.position = [4.0, -1.1, 2.0];
    this.leftLamp = new Lamp(gl);
    this.leftLamp.position = [0, 0.4, 0];
    this.nightstandLeft.addChild(this.leftLamp);
    this.addChild(this.nightstandLeft);

    // Initialize the right nightstand and its lamp
    this.nightstandRight = new Nightstand(gl);
    this.nightstandRight.position = [4.0, -1.1, -2.0];
    this.rightLamp = new Lamp(gl);
    this.rightLamp.position = [0, 0.4, 0];
    this.nightstandRight.addChild(this.rightLamp);
    this.addChild(this.nightstandRight);

    // Initialize other objects
    this.window = new Window(gl);
    this.window.position = [0.0, 1.5, 0];
    this.addChild(this.window);

    this.rug = new Rug(gl);
    this.rug.position = [-1.0, 0.1, 0.0];
    this.addChild(this.rug);
  }

  initRoom() {
    this.wallVertices = new Float32Array([
      // Floor vertices
      -5.0, -1.1, -5.0, 1.0, 1.0, 1.0, 5.0, -1.1, -5.0, 1.0, 1.0, 1.0, 5.0,
      -1.1, 5.0, 1.0, 1.0, 1.0, -5.0, -1.1, -5.0, 1.0, 1.0, 1.0, 5.0, -1.1, 5.0,
      1.0, 1.0, 1.0, -5.0, -1.1, 5.0, 1.0, 1.0, 1.0,
      // Wall and ceiling vertices ...
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

    // Draw the room
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.wallVertices.length / 6);

    // Draw children (furniture and other objects)
    this.children.forEach((child) => {
      child.draw(program, viewMatrix, projectionMatrix);
    });
  }

  update(timestamp) {
    super.update(timestamp);

    // Manually update each furniture item's position based on furnitureGroup's position
    this.updateFurnitureGroupTransform();
    // console.log("Furniture Group Position:", this.furnitureGroup.position);
  }

  updateFurnitureGroupTransform() {
    // Calculate positions based on group's position and initial offsets
    this.chair.position = [
      this.furnitureGroup.position[0] + this.chair.initialOffset[0],
      this.furnitureGroup.position[1] + this.chair.initialOffset[1],
      this.furnitureGroup.position[2] + this.chair.initialOffset[2],
    ];

    this.table.position = [
      this.furnitureGroup.position[0] + this.table.initialOffset[0],
      this.furnitureGroup.position[1] + this.table.initialOffset[1],
      this.furnitureGroup.position[2] + this.table.initialOffset[2],
    ];
  }
}
