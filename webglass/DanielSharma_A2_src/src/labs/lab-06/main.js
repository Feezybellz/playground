import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import { vec3, lookAtMatrix, perspectiveMatrix } from 'mv-redux'; // Import necessary mv-redux functions

import vertSource from './shaders/shape.vert';
import fragSource from './shaders/shape.frag';

import { SceneObject, generatePyramidVertices } from './shape';
import { menu, vec3FromSliders } from './menu';

// ----------------------

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.4, 0.4, 0.4, 1.0);
gl.enable(gl.DEPTH_TEST);

// Program and uniforms
// --------------------

const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource);
const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
const shapeProgram = linkProgram(gl, vs, fs);

gl.useProgram(shapeProgram);

// ===================================
// Query the program for its uniforms:

const uModelLocation = gl.getUniformLocation(shapeProgram, "uModel");
const uViewLocation = gl.getUniformLocation(shapeProgram, "uView");         // Query view matrix location
const uProjectionLocation = gl.getUniformLocation(shapeProgram, "uProjection"); // Query projection matrix location

// ===================================


// Buffer and vertex attributes
// ----------------------------

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, generatePyramidVertices(), gl.STATIC_DRAW);

const F32 = Float32Array.BYTES_PER_ELEMENT;
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, F32 * 6, F32 * 0); // Position
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, F32 * 6, F32 * 3); // Color
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

// Create shapes
// -------------

const shapes = [
    // One in the center...
    new SceneObject({ position: vec3(0, 0, 0), rotation: vec3(-Math.PI, 0, 0) }),
];

// Plus a few more in a circle
const numObjects = 16;
for (let i = 0; i < numObjects; i++) {
    const angle = Math.PI * 2 / numObjects * i;
    const x = Math.cos(angle) * 3;
    const z = Math.sin(angle) * 3;

    const position = vec3(x, 0, z);
    const rotation = vec3(0, Math.PI / 2 - angle, 0);

    shapes.push(new SceneObject({ position, rotation }));
}


// ----------------------

function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Makes the first pyramid animate a little bit
    shapes[0].scale = vec3(Math.sin(time / 1000) * 0.25 + 1);

    const cameraPosition = vec3FromSliders(menu.cameraPosition); // Get camera position from sliders
    const cameraTarget = vec3(0, 0, 0); // Camera looks at the origin

    // =======================================================================
    // Construct the view and projection matrices and pass them to the shader:

    // View matrix (from camera position looking at the origin)
    const viewMatrix = lookAtMatrix(cameraPosition, cameraTarget, vec3(0, 1, 0));

    // Projection matrix (standard perspective projection)
    const aspectRatio = canvas.width / canvas.height;
    const projectionMatrix = perspectiveMatrix(45, aspectRatio, 0.1, 100);

    // Send view and projection matrices to the shader
    gl.uniformMatrix4fv(uViewLocation, false, viewMatrix.flat());
    gl.uniformMatrix4fv(uProjectionLocation, false, projectionMatrix.flat());

    // =======================================================================

    for (const shape of shapes) {
        // =======================================================
        // Get the shape's model matrix and send it to the shader:

        const modelMatrix = shape.getModelMatrix(); // Get the shape's model matrix
        gl.uniformMatrix4fv(uModelLocation, false, modelMatrix.flat()); // Send it to the shader

        // =======================================================

        gl.drawArrays(gl.TRIANGLES, 0, 4 * 3);
    }

    window.requestAnimationFrame(draw);
}

draw();
