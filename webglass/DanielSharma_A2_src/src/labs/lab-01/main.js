import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import vertShaderStr from './shaders/triangle.vert';
import fragShaderStr from './shaders/triangle.frag';


// Get the canvas from the DOM and grab its WebGL context
const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

const points = new Float32Array([
    -1, -1,
     0,  1,
     1, -1,
]);


// Configure WebGL
// ---------------

// Setup viewport
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1.0, 1.0, 1.0, 1.0);

// Load shaders
const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertShaderStr);
const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderStr);
const program = linkProgram(gl, vertShader, fragShader);
gl.useProgram(program);

// Send vertex data to GPU
const bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

// Associate shader attributes with our data buffer
const aPosition = gl.getAttribLocation(program, 'aPosition');
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);


// Draw the triangle!
// ------------------

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
