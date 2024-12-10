import { vec2, radians, vec3 } from "mv-redux";
import { compileShader, linkProgram } from "mv-redux/init";
import vertSource from './shaders/triangle.vert';
import fragSource from './shaders/triangle.frag';


export class Triangle {

    /**
     * @param {WebGL2RenderingContext} gl
     */
    constructor(gl) {
        this.position = vec2(0, 0);
        this.scale = 1.00;

        // Create vertex data (sin and cos to get `x,y` points at 90, 210, 330 degrees around the unit
        // circle; i.e., an equilateral triangle):
        this.vertexData = [
            [
                vec2(Math.cos(radians(90)), Math.sin(radians(90))),
                vec3(1, 0, 0), // red
            ],
            [
                vec2(Math.cos(radians(210)), Math.sin(radians(210))),
                vec3(0, 1, 0), // green
            ],
            [
                vec2(Math.cos(radians(330)), Math.sin(radians(330))),
                vec3(0, 0, 1), // blue
            ],
        ];

        // Compile program
        const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
        this.program = linkProgram(gl, vs, fs);

        // Query for attribute locations
        this.aPosition = gl.getAttribLocation(this.program, 'aPosition');
        this.aColor = gl.getAttribLocation(this.program, 'aColor');
        this.uScaleLocation = gl.getUniformLocation(this.program, 'uScale');
        this.uPositionLocation = gl.getUniformLocation(this.program, 'uPosition');


        // Create buffer and fill it with vertex data
        this.buffer = gl.createBuffer();
        const rawData = new Float32Array(this.vertexData.flat(2));
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, rawData, gl.STATIC_DRAW);

        // =================================================================================================


    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    draw(gl) {
        gl.useProgram(this.program);

        // Bind our buffer and set our attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 5 * 4, 0 * 4);
        gl.vertexAttribPointer(this.aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

        // Make sure they're still enabled
        gl.enableVertexAttribArray(this.aPosition);
        gl.enableVertexAttribArray(this.aColor);


        gl.uniform1f(this.uScaleLocation, this.scale);
        gl.uniform2fv(this.uPositionLocation, this.position);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // =============================================================================================
    }
}