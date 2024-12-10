export class InputHandler {
  constructor(sceneGraph, camera1, camera2) {
    this.sceneGraph = sceneGraph;
    this.cameras = [camera1, camera2];
    this.activeCameraIndex = 0;

    // Bind UI elements
    this.bindCameraSelector();
    this.bindTransformSliders();
    this.bindCameraSliders();
  }

  bindCameraSelector() {
    const cameraSelect = document.getElementById("camera-select");
    cameraSelect.addEventListener("change", (event) => {
      this.activeCameraIndex = parseInt(event.target.value);
    });
  }

  bindTransformSliders() {
    const translateX = document.getElementById("translate-x");
    const translateY = document.getElementById("translate-y");
    const translateZ = document.getElementById("translate-z");

    translateX.addEventListener("input", (event) => {
      this.sceneGraph.root.position[0] = parseFloat(event.target.value);
    });
    translateY.addEventListener("input", (event) => {
      this.sceneGraph.root.position[1] = parseFloat(event.target.value);
    });
    translateZ.addEventListener("input", (event) => {
      this.sceneGraph.root.position[2] = parseFloat(event.target.value);
    });
  }

  bindCameraSliders() {
    const cameraX = document.getElementById("camera-x");
    const cameraY = document.getElementById("camera-y");
    const cameraZ = document.getElementById("camera-z");

    cameraX.addEventListener("input", (event) => {
      this.cameras[this.activeCameraIndex].position[0] = parseFloat(
        event.target.value
      );
    });
    cameraY.addEventListener("input", (event) => {
      this.cameras[this.activeCameraIndex].position[1] = parseFloat(
        event.target.value
      );
    });
    cameraZ.addEventListener("input", (event) => {
      this.cameras[this.activeCameraIndex].position[2] = parseFloat(
        event.target.value
      );
    });
  }

  getActiveCamera() {
    return this.cameras[this.activeCameraIndex];
  }
}
