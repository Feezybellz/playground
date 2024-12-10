import { Camera } from "./Camera.js";

export class POVCamera extends Camera {
  constructor(targetObject, fov = 45, aspect = 1, near = 0.1, far = 100) {
    // Get initial position but don't rely on it long term
    const initialPos = targetObject.position || [0, 0, 0];
    const initialTarget = [initialPos[0], initialPos[1], initialPos[2] + 1];
    const up = [0, 1, 0];

    super(initialPos, initialTarget, up, fov, aspect, near, far);

    this.targetObject = targetObject;
    this.offset = [0, 0, 0];
    // Store last known position to detect movement
    this.lastKnownPosition = [initialPos[0], initialPos[1] + 5, initialPos[2]];
  }

  static calculateObjectCenter(object) {
    // For a group, we need to consider its world position
    if (object.worldMatrix) {
      // Extract position from world matrix
      return [
        object.worldMatrix[12], // Translation X from matrix
        object.worldMatrix[13], // Translation Y from matrix
        object.worldMatrix[14], // Translation Z from matrix
      ];
    }

    // Fallback to direct position if available
    if (object.position) {
      return [...object.position];
    }

    // If we have bounds, use their center
    if (object.bounds) {
      const { minX, maxX, minY, maxY, minZ, maxZ } = object.bounds;
      return [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2];
    }

    console.warn("Unable to determine object position");
    return [0, 0, 0];
  }

  static eulerToDirection(rotationX, rotationY, rotationZ) {
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);

    // Calculate direction based on rotations
    const x = sinY;
    const y = -sinX * cosY;
    const z = cosX * cosY;

    // Normalize
    const length = Math.sqrt(x * x + y * y + z * z);
    return [x / length, y / length, z / length];
  }

  static normalizeVector(v) {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length === 0) return [...v];
    return [v[0] / length, v[1] / length, v[2] / length];
  }

  static getRotationFromMatrix(matrix) {
    // Extract rotation from world matrix
    // This assumes the matrix is composed of rotation and translation only
    const rotationMatrix = [
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[4],
      matrix[5],
      matrix[6],
      matrix[8],
      matrix[9],
      matrix[10],
    ];

    // Convert to Euler angles (assuming YXZ order)
    const y = Math.atan2(rotationMatrix[2], rotationMatrix[0]);
    const x = Math.atan2(-rotationMatrix[5], rotationMatrix[4]);
    const z = Math.atan2(-rotationMatrix[1], rotationMatrix[0] / Math.cos(y));

    return [x, y, z];
  }

  updatePosition() {
    if (!this.targetObject) {
      console.warn("POVCamera: No target object set");
      return;
    }

    // Get current world position of the group/object
    const currentPos = POVCamera.calculateObjectCenter(this.targetObject);

    // Get rotation either from world matrix or direct rotation property
    let rotation;
    if (this.targetObject.worldMatrix) {
      rotation = POVCamera.getRotationFromMatrix(this.targetObject.worldMatrix);
    } else {
      rotation = this.targetObject.rotation || [0, 0, 0];
    }

    // Calculate forward direction based on rotation
    const forward = POVCamera.eulerToDirection(...rotation);

    // Update camera position to match object
    this.position = [
      currentPos[0] + this.offset[0],
      currentPos[1] + this.offset[1],
      currentPos[2] + this.offset[2],
    ];

    // Set look-at target in front of camera
    const lookDistance = 1;
    this.target = [
      this.position[0] + forward[0] * lookDistance,
      this.position[1] + forward[1] * lookDistance,
      this.position[2] + forward[2] * lookDistance,
    ];

    // Store current position for next frame
    this.lastKnownPosition = [...currentPos];

    // Update the view matrix
    this.viewMatrix = this.computeViewMatrix();
  }

  setTargetObject(targetObject) {
    this.targetObject = targetObject;
    if (targetObject) {
      const pos = POVCamera.calculateObjectCenter(targetObject);
      this.lastKnownPosition = [...pos];
    }
    this.updatePosition();
  }

  setOffset(x, y, z) {
    this.offset = [x, y, z];
  }

  draw(program, viewMatrix, projectionMatrix) {
    this.updatePosition();
    super.draw(program, viewMatrix, projectionMatrix);
  }
}
