import { SceneObject } from "./SceneObject.js";

export class BedroomScene {
  constructor() {
    this.root = new SceneObject(); // Initialize the root as a SceneObject

    // Walls
    const leftWall = this.createWall([-5, 0, 0], [0.1, 5, 10]);
    const rightWall = this.createWall([5, 0, 0], [0.1, 5, 10]);
    const backWall = this.createWall([0, 0, -5], [10, 5, 0.1]);
    const floor = this.createWall([0, -2.5, 0], [10, 0.1, 10]);

    // Furniture
    const bed = this.createFurniture(
      [0, -2, -2],
      [3, 0.5, 2],
      [0.6, 0.3, 0.2, 1]
    ); // Brown bed
    const table = this.createFurniture(
      [2, -2.2, 2],
      [1, 0.3, 1],
      [0.5, 0.3, 0.2, 1]
    ); // Small table
    const wardrobe = this.createFurniture(
      [-3, -1.5, -3],
      [1, 3, 1],
      [0.4, 0.2, 0.1, 1]
    ); // Tall wardrobe

    // Add objects to the root
    this.root.addChild(leftWall);
    this.root.addChild(rightWall);
    this.root.addChild(backWall);
    this.root.addChild(floor);
    this.root.addChild(bed);
    this.root.addChild(table);
    this.root.addChild(wardrobe);
  }

  createWall(position, scale) {
    const wall = new SceneObject();
    wall.position = position;
    wall.scale = scale;
    wall.color = [0.9, 0.9, 0.9, 1.0]; // Light gray
    return wall;
  }

  createFurniture(position, scale, color) {
    const furniture = new SceneObject();
    furniture.position = position;
    furniture.scale = scale;
    furniture.color = color;
    return furniture;
  }

  getRoot() {
    return this.root;
  }
}
