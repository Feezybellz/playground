import { SceneObject } from "./SceneObject.js";

export class SceneGraph {
  constructor() {
    this.root = new SceneObject(); // Always initialize with a default root
  }

  setRoot(rootObject) {
    if (!(rootObject instanceof SceneObject)) {
      throw new Error("Root must be an instance of SceneObject.");
    }
    this.root = rootObject;
  }

  addChild(child) {
    if (!(child instanceof SceneObject)) {
      throw new Error("Child must be an instance of SceneObject.");
    }
    this.root.addChild(child);
  }

  render(gl, activeCamera, uModelViewMatrix, uProjectionMatrix, uColor) {
    if (!this.root) {
      console.warn("SceneGraph has no root object to render.");
      return;
    }

    // Update camera matrices if needed
    activeCamera.updateProjectionMatrix();

    // Traverse the hierarchy and render
    this.root.render(
      gl,
      mat4.create(),
      uModelViewMatrix,
      uProjectionMatrix,
      uColor
    );
  }
}
