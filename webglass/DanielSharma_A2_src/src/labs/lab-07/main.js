import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import { lookAtMatrix, mat4, perspectiveMatrix, radians, translationMatrix, vec3 } from 'mv-redux';

import vertSource from './shaders/shape.vert';
import fragSource from './shaders/shape.frag';

import { SceneObject, generateCubeVertices } from './shape';
import { menu, vec3FromSliders } from './menu';

// ------------------------------

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

const uModelLocation = gl.getUniformLocation(shapeProgram, 'uModel');
const uViewLocation = gl.getUniformLocation(shapeProgram, 'uView');
const uProjLocation = gl.getUniformLocation(shapeProgram, 'uProjection');

// Buffer and vertex attributes
// ----------------------------

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, generateCubeVertices(), gl.STATIC_DRAW);

// Note: by using `layout(location = X)` in the vertex shader, we avoid needing to query for each
// attribute's location and can instead just reference them directly by number.
const F32 = Float32Array.BYTES_PER_ELEMENT;
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, F32 * 6, F32 * 0); // Position
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, F32 * 6, F32 * 3); // Color
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

// ------------------------------

let vertexCount = 36;
let spinEnabled = false;
let growEnabled = false;

const shape = new SceneObject({
    position: vec3(0, 0, 0),
    rotation: vec3(0, 0, 0),
    scale: vec3(1.0, 1.0, 1.0),
});


function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // ==========================================================
    // Send any additional uniform information for lights here...

    // ==========================================================

    // Shape update
    if (growEnabled) shape.scale.x = Math.cos(time / 2000) * 0.25 + 1;
    if (spinEnabled) {
        shape.rotation.x = Math.sin(time / 5000) * Math.PI * 2;
        shape.rotation.z = radians(45);
    }

    // ----------------------------------------------------------
    // Camera and model matrices

    const cameraPosition = vec3FromSliders(menu.cameraPosition);
    const cameraTarget = vec3(0, 0, 0);

    const modelMatrix = shape.getModelMatrix();
    const viewMatrix = lookAtMatrix(cameraPosition, cameraTarget);
    const projMatrix = perspectiveMatrix(radians(45), canvas.width / canvas.height, 0.1, 100);

    gl.uniformMatrix4fv(uModelLocation, false, modelMatrix.flat());
    gl.uniformMatrix4fv(uViewLocation, false, viewMatrix.flat());
    gl.uniformMatrix4fv(uProjLocation, false, projMatrix.flat());

    // ----------------------------------------------------------

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    window.requestAnimationFrame(draw);
}

draw();
