import { Utils } from "./modules/Utils.js";
import { Chair } from "./modules/Chair.js";
import { Table } from "./modules/Table.js";
import { Bed } from "./modules/Bed.js";
import { Lamp } from "./modules/Lamp.js";
import { LampStand } from "./modules/LampStand.js";
import { Rug } from "./modules/Rug.js";
import { Window } from "./modules/Window.js";

const canvas = document.getElementById("gl-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported!");
}

// Corrected shader sources
const vertexShaderSource = `
    attribute vec3 aPosition;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;

// Initialize the shader program
const shaderProgram = Utils.initShaderProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource
);
if (!shaderProgram) {
  console.error("Shader program initialization failed.");
}
gl.useProgram(shaderProgram);

// Set up the projection matrix
const projectionMatrix = mat4.create();
mat4.perspective(
  projectionMatrix,
  Math.PI / 4,
  canvas.width / canvas.height,
  0.1,
  100
);
const uProjectionMatrixLocation = gl.getUniformLocation(
  shaderProgram,
  "uProjectionMatrix"
);
gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);

// Initialize each object and add them to the scene
const chair = new Chair(gl, shaderProgram);
const table = new Table(gl, shaderProgram);
const bed = new Bed(gl, shaderProgram);
const lamp = new Lamp(gl, shaderProgram);
const lampStand = new LampStand(gl, shaderProgram);
const rug = new Rug(gl, shaderProgram);
const window = new Window(gl, shaderProgram);

// Set the background color and enable depth testing
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

const viewMatrix = mat4.create();
mat4.lookAt(viewMatrix, [0, 5, 15], [0, 0, 0], [0, 1, 0]);
const uViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uViewMatrix");
gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);

// Render loop
function render() {
  // Clear the color and depth buffer each frame
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw each object
  rug.draw();
  rug.position[0] = -6;
  rug.position[1] = 0;
  //   bed.draw();
  //   table.draw();
  //   chair.draw();
  //   lampStand.draw();
  //   lamp.draw();
  //   window.draw();

  requestAnimationFrame(render);
}

render();
