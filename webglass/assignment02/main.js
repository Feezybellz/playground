import { Room } from "./scene/Room.js";

import { Chair } from "./scene/Chair.js";
import { Table } from "./scene/Table.js";
import { Camera } from "./cameras/Camera.js";
import { Group } from "./scene/Group.js";
import vertShaderSource from "./shaders/basic.vert.js";
import fragShaderSource from "./shaders/basic.frag.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Compile shaders
  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function linkProgram(gl, vertShader, fragShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertShaderSource);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
  const program = linkProgram(gl, vertShader, fragShader);

  const room = new Room(gl);

  const mainCamera = new Camera(
    [0, 3, -7],
    [0, 0, 0],
    [0, 1, 0],
    45,
    canvas.width / canvas.height
  );

  const povCamera = new Camera(
    [0, 1.5, 0],
    [0, 0, 0],
    [0, 1, 0],
    45,
    canvas.width / canvas.height
  );
  // room.chair.addChild(povCamera);

  const furnitureGroup = new Group(gl);

  // Initialize furniture with positions relative to group
  const chair = new Chair(gl);
  chair.position = [-3.5, -1.1, 1.5];
  chair.rotation = [0, Math.PI, 0];

  const table = new Table(gl);
  table.position = [-3.5, -1.1, 3.5];
  table.rotation = [0, Math.PI / 2, 0];

  // Build furniture group
  furnitureGroup.addChild(chair);
  furnitureGroup.addChild(table);

  room.addChild(furnitureGroup);

  let activeCamera = mainCamera;
  document
    .getElementById("cameraSelect")
    .addEventListener("change", (event) => {
      const target = event.target;
      if (target instanceof HTMLSelectElement) {
        activeCamera = target.value === "pov" ? povCamera : mainCamera;
      }
    });

  // Helper function to safely get input value from event target
  function getInputValue(event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      return parseFloat(target.value);
    }
    return null;
  }

  // Furniture group position control
  document.getElementById("furnitureX").addEventListener("input", (e) => {
    const x = parseFloat(e.target.value);
    const positions = furnitureGroup.getPosition();
    positions[0] = x;

    furnitureGroup.setPosition(...positions);
  });

  document.getElementById("furnitureY").addEventListener("input", (e) => {
    const y = parseFloat(e.target.value);
    const positions = furnitureGroup.getPosition();
    positions[1] = y;

    furnitureGroup.setPosition(...positions);
  });

  document.getElementById("furnitureZ").addEventListener("input", (e) => {
    const z = parseFloat(e.target.value);
    console.log(z);

    const positions = furnitureGroup.getPosition();
    positions[2] = z;

    furnitureGroup.setPosition(...positions);
  });

  document
    .getElementById("furnitureRotationY")
    .addEventListener("input", (e) => {
      // room.table.rotation[1] = parseFloat(e.target.value) * (Math.PI / 180);
      const rY = parseFloat(e.target.value) * (Math.PI / 180);

      const rotations = furnitureGroup.getRotation();
      rotations[1] = rY;

      furnitureGroup.setRotation(...rotations);
    });

  document.getElementById("leftNightstandX").addEventListener("input", (e) => {
    room.nightstandLeft.position[0] = parseFloat(e.target.value);
  });
  document.getElementById("leftNightstandZ").addEventListener("input", (e) => {
    room.nightstandLeft.position[2] = parseFloat(e.target.value);
  });

  document.getElementById("leftLampX").addEventListener("input", (e) => {
    room.lampLeft.position[0] = parseFloat(e.target.value);
  });

  document.getElementById("leftLampY").addEventListener("input", (e) => {
    room.lampLeft.position[1] = parseFloat(e.target.value);
  });

  document.getElementById("leftLampZ").addEventListener("input", (e) => {
    room.lampLeft.position[2] = parseFloat(e.target.value);
  });

  document.getElementById("rightNightstandX").addEventListener("input", (e) => {
    room.nightstandRight.position[0] = parseFloat(e.target.value);
  });
  document.getElementById("rightNightstandZ").addEventListener("input", (e) => {
    room.nightstandRight.position[2] = parseFloat(e.target.value);
  });

  document.getElementById("rightLampX").addEventListener("input", (e) => {
    room.lampRight.position[0] = parseFloat(e.target.value);
  });

  document.getElementById("rightLampY").addEventListener("input", (e) => {
    room.lampRight.position[1] = parseFloat(e.target.value);
  });

  document.getElementById("rightLampZ").addEventListener("input", (e) => {
    room.lampRight.position[2] = parseFloat(e.target.value);
  });

  // UI Controls for main camera movement
  document.getElementById("xAxis").addEventListener("input", (event) => {
    const x = getInputValue(event);
    if (x !== null) {
      mainCamera.updatePosition(
        x,
        mainCamera.position[1],
        mainCamera.position[2]
      );
    }
  });

  document.getElementById("yAxis").addEventListener("input", (event) => {
    const y = getInputValue(event);
    if (y !== null) {
      mainCamera.updatePosition(
        mainCamera.position[0],
        y,
        mainCamera.position[2]
      );
    }
  });

  document.getElementById("zAxis").addEventListener("input", (event) => {
    const z = getInputValue(event);
    if (z !== null) {
      mainCamera.updatePosition(
        mainCamera.position[0],
        mainCamera.position[1],
        z
      );
    }
  });

  // Draw loop
  //   function drawScene(timestamp) {
  //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //     room.update(timestamp);
  //     const viewMatrix = activeCamera.getViewMatrix();
  //     const projectionMatrix = activeCamera.getProjectionMatrix();
  //     room.draw(program, viewMatrix, projectionMatrix);
  //     window.requestAnimationFrame(drawScene);
  //   }
  function drawScene(timestamp) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update the room (and implicitly update furnitureGroup)
    room.update(timestamp);

    // Draw the room and its children
    const viewMatrix = activeCamera.getViewMatrix();
    const projectionMatrix = activeCamera.getProjectionMatrix();
    room.draw(program, viewMatrix, projectionMatrix);
    room.draw(program, viewMatrix, projectionMatrix);

    window.requestAnimationFrame(drawScene);
  }

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.7, 0.7, 0.7, 1.0);
  gl.useProgram(program);

  // Start animation loop
  drawScene();
});
