import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import vertShaderSource from './shaders/triangle.vert';
import fragShaderSource from './shaders/triangle.frag';

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

// Vertex data
// -------------------------------------------------

const t1Vertices = [
    //    x,     y
    [  0.00,  0.55, 1.0, 0.5, 0.8 ],  
    [ -0.47, -0.27, 0.0, 0.0, 0.0 ],  
    [  0.47, -0.27, 0.0, 1.0, 1.0 ],
];

const t2Vertices = [
    //    x,     y
    [ -0.21,  0.12, 1.0, 0.0, 0.0 ], 
    [  0.00, -0.25, 0.0, 1.0, 1.0 ],  
    [  0.21,  0.12, 1.0, 0.0, 1.0 ],
];

// Setup
// -------------------------------------------------

// Configure viewport:
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.7, 0.7, 0.7, 1.0);

// Compile and setup our program:
const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertShaderSource);
const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
const program = linkProgram(gl, vertShader, fragShader);
gl.useProgram(program);

// Ask the program object which ("location") our vertex attributes were assigned and enable them:
const aPosition = gl.getAttribLocation(program, 'aPosition');
const aColor = gl.getAttribLocation(program, 'aColor');
gl.enableVertexAttribArray(aPosition);
gl.enableVertexAttribArray(aColor);

// Create buffers for our two triangles:
const buffer1 = gl.createBuffer();
const buffer2 = gl.createBuffer();

// Drawing
// -------------------------------------------------
function draw(timestamp = 0){
    // Clear the screen:
    gl.clear(gl.COLOR_BUFFER_BIT);
    const time = timestamp * 0.01;

    // Draw triangle #1
    // ----------------
    const t1VerticesAnimated = t1Vertices.map(vertex => [
        vertex[0] + 0.2 * Math.sin(time),  
        vertex[1],   
        vertex[2], vertex[3], vertex[4]
    ]);
    const t2VerticesAnimated = t2Vertices.map(vertex => [
        vertex[0],  
        vertex[1] + 0.2 * Math.cos(time),  
        vertex[2], vertex[3], vertex[4]
    ]);

    // Prepare our vertices to go to the GPU:
    const t1Flattened = t1VerticesAnimated.flat();                // array of arrays -> array
    const t1VertexData = new Float32Array(t1Flattened);   // convert to raw 32-bit floats instead of JS numbers

    // Set buffer1 to be the current ARRAY_BUFFER and pass its data:
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, t1VertexData, gl.STATIC_DRAW);

    // Configure the pointer for aPosition:
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);

    // Draw!
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Draw triangle #2
    // ----------------
    const t2Flattened = t2VerticesAnimated.flat();
    const t2VertexData = new Float32Array(t2VerticesAnimated.flat());

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, t2VertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.requestAnimationFrame(draw);
}
draw();