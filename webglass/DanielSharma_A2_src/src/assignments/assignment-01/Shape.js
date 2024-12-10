export class Shape {
    constructor(gl) {
        this.gl = gl;
        this.position = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.rotation = { x: 0, y: 0, z: 0 };
    }

    updatePosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    updateScale(x, y, z) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }

    updateRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }

    applyTransformations(program) {
        const uScaleLocation = this.gl.getUniformLocation(program, 'uScale');
        const uPositionLocation = this.gl.getUniformLocation(program, 'uPosition');
        const uRotationXLocation = this.gl.getUniformLocation(program, 'uRotationX');
        const uRotationYLocation = this.gl.getUniformLocation(program, 'uRotationY');
        const uRotationZLocation = this.gl.getUniformLocation(program, 'uRotationZ');

        this.gl.uniform3f(uScaleLocation, this.scale.x, this.scale.y, this.scale.z);
        this.gl.uniform3f(uPositionLocation, this.position.x, this.position.y, this.position.z);
        this.gl.uniform1f(uRotationXLocation, this.rotation.x);
        this.gl.uniform1f(uRotationYLocation, this.rotation.y);
        this.gl.uniform1f(uRotationZLocation, this.rotation.z);
    }

    update(deltaTime) {
        this.rotation.y += deltaTime * 0.001;
    }
}
