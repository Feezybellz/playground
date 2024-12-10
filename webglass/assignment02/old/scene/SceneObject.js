// SceneObject.js
export class SceneObject {
    constructor(gl = null, vertices = null) {
        this.gl = gl;                // WebGL context, optional
        this.vertices = vertices;    // Vertex data, optional

        this.position = [0, 0, 0];   // [x, y, z]
        this.rotation = [0, 0, 0];   // [rx, ry, rz]
        this.scale = [1, 1, 1];      // [sx, sy, sz]
        this.children = [];          // Array of child SceneObjects
    }

    addChild(child) {
        this.children.push(child);
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    getModelMatrix() {
        const [x, y, z] = this.position;
        const [rx, ry, rz] = this.rotation;
        const [sx, sy, sz] = this.scale;

        // Translation matrix
        const translationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];

        // Rotation matrices for X, Y, Z axes
        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        const rotationXMatrix = [
            1, 0, 0, 0,
            0, cosX, -sinX, 0,
            0, sinX, cosX, 0,
            0, 0, 0, 1
        ];

        const rotationYMatrix = [
            cosY, 0, sinY, 0,
            0, 1, 0, 0,
            -sinY, 0, cosY, 0,
            0, 0, 0, 1
        ];

        const rotationZMatrix = [
            cosZ, -sinZ, 0, 0,
            sinZ, cosZ, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        // Scale matrix
        const scaleMatrix = [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];

        // Combine transformations: Translation * RotationZ * RotationY * RotationX * Scale
        let modelMatrix = this.multiplyMatrices(
            translationMatrix,
            this.multiplyMatrices(
                rotationZMatrix,
                this.multiplyMatrices(rotationYMatrix, rotationXMatrix)
            )
        );

        modelMatrix = this.multiplyMatrices(modelMatrix, scaleMatrix);
        return modelMatrix;
    }

    draw(program, viewMatrix, projectionMatrix, parentMatrix = null) {
        // Calculate combined model matrix
        const modelMatrix = parentMatrix
            ? this.multiplyMatrices(parentMatrix, this.getModelMatrix())
            : this.getModelMatrix();
            
        // Only render if we have vertex data
        if (this.gl && this.vertices) {
            const uModelMatrix = this.gl.getUniformLocation(program, 'uModelMatrix');
            const uViewMatrix = this.gl.getUniformLocation(program, 'uViewMatrix');
            const uProjectionMatrix = this.gl.getUniformLocation(program, 'uProjectionMatrix');

            this.gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
            this.gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
            this.gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 6);
        }

        // Draw each child with the updated model matrix
        this.children.forEach(child => {
            console.log("Drawing child with updated matrix...");
            child.draw(program, viewMatrix, projectionMatrix, modelMatrix);
        });
    }

    update(timestamp) {
        // Optionally update the current object, if needed (e.g., animations)
        this.children.forEach(child => child.update(timestamp));
    }

    multiplyMatrices(a, b) {
        const result = new Array(16).fill(0);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                for (let i = 0; i < 4; i++) {
                    result[row * 4 + col] += a[row * 4 + i] * b[i * 4 + col];
                }
            }
        }
        return result;
    }
}
