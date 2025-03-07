// POVCamera.js
import { Camera } from "./Camera.js";
import { Chair } from "../scene/Chair.js";

export class POVCamera extends Camera {
  constructor(chair, fov = 45, aspect = 1, near = 0.1, far = 100) {
    // Initialize the POV Camera with the chair's position and orientation
    const position = chair.position;
    const target = [
      chair.position[0],
      chair.position[1],
      chair.position[2] + 1,
    ]; // Default target, can be adjusted later
    const up = [0, 1, 0]; // Up vector for camera orientation

    super(position, target, up, fov, aspect, near, far);

    this.chair = chair; // Attach to the chair object
  }

  updatePosition() {
    // Update the position based on chair's position and rotation
    this.position = this.chair.position;
    // Adjust the target based on the chair's orientation (rotation)
    const targetX = this.chair.position[0] + Math.sin(this.chair.rotation[1]);
    const targetY = this.chair.position[1];
    const targetZ = this.chair.position[2] + Math.cos(this.chair.rotation[1]);
    this.target = [targetX, targetY, targetZ];

    // Recompute the view matrix
    this.viewMatrix = this.computeViewMatrix();
  }

  draw(program, viewMatrix, projectionMatrix) {
    this.updatePosition(); // Ensure the POV camera moves with the chair
    super.draw(program, viewMatrix, projectionMatrix);
  }
}
