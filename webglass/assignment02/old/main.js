import { Room } from "./scene/Room.js";
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
      console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
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
      console.error("Error linking program:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertShaderSource);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
  const program = linkProgram(gl, vertShader, fragShader);

  const room = new Room(gl);
  const sideTable = new Group(gl); // Side table group
  const lamp = new Group(gl); // Lamp group

  // Add the lamp as a child of the side table
  sideTable.addChild(lamp);

  // Add the side table (with the lamp) to the room
  room.addChild(sideTable);

  // Initialize the main camera and an additional POV camera as a child of the chair
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
  room.chair.addChild(povCamera);

  // Create a group for the furniture
  const furnitureGroup = new Group();
  furnitureGroup.addChild(room.chair);
  furnitureGroup.addChild(room.table);
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

  // UI Controls for furniture group position and rotation
  //   document.getElementById("groupX").addEventListener("input", (event) => {
  //     const x = getInputValue(event);
  //     if (x !== null) {
  //       furnitureGroup.position[0] = x;
  //     }
  //   });

  //   document.getElementById("groupY").addEventListener("input", (event) => {
  //     const y = getInputValue(event);
  //     if (y !== null) {
  //       furnitureGroup.position[1] = y;
  //     }
  //   });

  //   document.getElementById("groupZ").addEventListener("input", (event) => {
  //     const z = getInputValue(event);
  //     if (z !== null) {
  //       furnitureGroup.position[2] = z;
  //     }
  //   });

  //   document
  //     .getElementById("groupRotationY")
  //     .addEventListener("input", (event) => {
  //       const angle = getInputValue(event);
  //       if (angle !== null) {
  //         furnitureGroup.rotation[1] = angle * (Math.PI / 180); // Convert degrees to radians
  //       }
  //     });

  document.getElementById("groupX").addEventListener("input", (event) => {
    const x = getInputValue(event);
    if (x !== null) {
      furnitureGroup.position[0] = x;
    }
  });

  document.getElementById("groupY").addEventListener("input", (event) => {
    const y = getInputValue(event);
    if (y !== null) {
      furnitureGroup.position[1] = y;
    }
  });

  document.getElementById("groupZ").addEventListener("input", (event) => {
    const z = getInputValue(event);
    if (z !== null) {
      furnitureGroup.position[2] = z;
    }
  });

  document
    .getElementById("groupRotationY")
    .addEventListener("input", (event) => {
      const angle = getInputValue(event);
      if (angle !== null) {
        furnitureGroup.rotation[1] = angle * (Math.PI / 180); // Convert degrees to radians
      }
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

    // Update the group's model matrix
    furnitureGroup.update(timestamp);

    // Draw the group
    const viewMatrix = activeCamera.getViewMatrix();
    const projectionMatrix = activeCamera.getProjectionMatrix();
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
