import { Shape } from './Shape.js';

export class Pyramid extends Shape {
    constructor(gl) {
        super(gl);

        this.vertexData = [
            -0.5, 0.0,  0.5,  
             0.5, 0.0,  0.5,  
             0.5, 0.0, -0.5,  
            -0.5, 0.0, -0.5,  

            -0.5, 0.0,  0.5,  
             0.5, 0.0,  0.5,  
             0.0, 0.75, 0.0,  

             0.5, 0.0,  0.5,  
             0.5, 0.0, -0.5,  
             0.0, 0.75, 0.0,  

             0.5, 0.0, -0.5,  
            -0.5, 0.0, -0.5,  
             0.0, 0.75, 0.0,  

            -0.5, 0.0, -0.5,  
            -0.5, 0.0,  0.5,  
             0.0, 0.75, 0.0,  
        ];

        this.colorData = [
            0.9, 0.2, 0.3,  
            0.9, 0.2, 0.3,  
            0.9, 0.2, 0.3,  
            0.9, 0.2, 0.3,  

            0.4, 0.8, 0.1,  
            0.4, 0.8, 0.1,  
            0.4, 0.8, 0.1,  

            0.2, 0.5, 1.0,  
            0.2, 0.5, 1.0,  
            0.2, 0.5, 1.0,  

            1.0, 0.6, 0.2,  
            1.0, 0.6, 0.2,  
            1.0, 0.6, 0.2,  

            0.5, 0.3, 0.8,  
            0.5, 0.3, 0.8,  
            0.5, 0.3, 0.8,  
        ];

        this.indexData = [
            0, 1, 2,  0, 2, 3,
            4, 5, 6,
            7, 8, 9,
            10, 11, 12,
            13, 14, 15,
        ];

        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorData), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
    }

    render(program) {
        const gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = gl.getAttribLocation(program, 'aPosition');
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        const colorLocation = gl.getAttribLocation(program, 'aColor');
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLocation);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.applyTransformations(program);

        gl.drawElements(gl.TRIANGLES, this.indexData.length, gl.UNSIGNED_SHORT, 0);
    }

    update(deltaTime) {
        this.rotation.x += deltaTime * 0.001;
        this.rotation.y += deltaTime * 0.001;
        this.rotation.z += deltaTime * 0.001;
    }
}
