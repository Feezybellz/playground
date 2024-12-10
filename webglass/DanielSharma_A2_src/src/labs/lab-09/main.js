import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import { lookAtMatrix, perspectiveMatrix, radians, vec3 } from 'mv-redux';

import vertSource from './shaders/shaded.vert';
import fragSource from './shaders/shaded.frag';

import { SceneObject } from './shape';
import { Mesh } from './mesh';
import { menu } from './menu';

// ------------------------------

const F32 = Float32Array.BYTES_PER_ELEMENT;

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.4, 0.4, 0.4, 1.0);
gl.enable(gl.DEPTH_TEST);

// Program and uniforms
// --------------------

const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource);
const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
const shadedProgram = linkProgram(gl, vs, fs);

gl.useProgram(shadedProgram);

const uModelLocation = gl.getUniformLocation(shadedProgram, 'uModelMatrix');
const uViewLocation = gl.getUniformLocation(shadedProgram, 'uViewMatrix');
const uProjLocation = gl.getUniformLocation(shadedProgram, 'uProjMatrix');


// Mesh and object definitions
// ---------------------------

let spinEnabled = true;
let growEnabled = false;

/** @type {SceneObject | undefined} */
let model = undefined; // Set when model is loaded

function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (model && growEnabled) {
        model.scale = vec3(Math.cos(time / 2000) * 0.5 + 1.0);
    }

    if (model && spinEnabled) {
        model.rotation.y += 0.01;
    }

    // ==========================================================
    // Send lighting and material uniforms:



    // ==========================================================

    const cameraPosition = menu.cameraPosition;
    const cameraTarget = vec3(0, 0, 0);

    const viewMatrix = lookAtMatrix(cameraPosition, cameraTarget);
    const projMatrix = perspectiveMatrix(radians(45), canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(uViewLocation, false, viewMatrix.flat());
    gl.uniformMatrix4fv(uProjLocation, false, projMatrix.flat());

    if (model) {
        const modelMatrix = model.getModelMatrix();

        gl.uniformMatrix4fv(uModelLocation, false, modelMatrix.flat());

        model.mesh.draw();
    }

    // ==========================================================

    window.requestAnimationFrame(draw);
}

draw();


/*
 * Teapot models from: https://users.cs.utah.edu/~dejohnso/models/teapot.html
 * (converted to raw binary data with a custom script)
 *
 * The low-, medium-, and high-quality teapots have 5144, 22885, and 158865 triangles respectively.
 */
const modelUrl = new URL('./models/teapot_surface1.norm.bin', import.meta.url);
const numTriangles = 22885;

fetch(modelUrl)
    .then(response => response.arrayBuffer())
    .then(dataBuffer => {
        const numVerts = numTriangles * 3;

        const modelMesh = new Mesh(gl, dataBuffer, numVerts, [
            { size: 3, type: gl.FLOAT, stride: 6 * F32, offset: 0 * F32 }, // Position
            { size: 3, type: gl.FLOAT, stride: 6 * F32, offset: 3 * F32 }, // Normal
        ]);

        model = new SceneObject(modelMesh, {
            position: vec3(0, -1, 0), // shift down a bit
        });
    });
