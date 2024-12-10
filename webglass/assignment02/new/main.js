import { SceneObject } from "./modules/SceneObject.js";
import { Camera } from "./modules/Camera.js";
import { SceneGraph } from "./modules/SceneGraph.js";
import { InputHandler } from "./modules/InputHandler.js";
import { Utils } from "./modules/Utils.js";
import { BedroomScene } from "./modules/BedroomScene.js";

const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl");

// Check for WebGL support
if (!gl) {
  alert("WebGL not supported!");
}

// Load shaders
const vertexShaderSource = Utils.loadShaderSource("vertex-shader");
const fragmentShaderSource = Utils.loadShaderSource("fragment-shader");

// Compile and link shaders
const shaderProgram = Utils.createProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource
);
gl.useProgram(shaderProgram);

// Get attribute and uniform locations
const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
const uModelViewMatrix = gl.getUniformLocation(
  shaderProgram,
  "uModelViewMatrix"
);
const uProjectionMatrix = gl.getUniformLocation(
  shaderProgram,
  "uProjectionMatrix"
);
const uColor = gl.getUniformLocation(shaderProgram, "uColor");

// Set up scene
const sceneGraph = new SceneGraph();
const rootObject = new SceneObject();
sceneGraph.setRoot(rootObject);

// Add cameras
const camera1 = new Camera(gl, 45, 0.1, 100);
const camera2 = new Camera(gl, 60, 0.1, 100);

// Create the bedroom scene and set it as the root
const bedroomScene = new BedroomScene();
sceneGraph.setRoot(bedroomScene.getRoot());

// Add cameras to the scene graph
sceneGraph.addChild(camera1);
sceneGraph.addChild(camera2);

// Input handler
const inputHandler = new InputHandler(sceneGraph, camera1, camera2);

// Rendering loop
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const activeCamera = inputHandler.getActiveCamera();
  sceneGraph.render(
    gl,
    activeCamera,
    uModelViewMatrix,
    uProjectionMatrix,
    uColor
  );

  requestAnimationFrame(render);
}

// Initialize WebGL settings
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

// Start rendering loop
render();
