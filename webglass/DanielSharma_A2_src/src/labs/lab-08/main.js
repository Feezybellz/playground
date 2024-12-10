import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import { lookAtMatrix, perspectiveMatrix, radians, vec3 } from 'mv-redux';

import vertSource from './shaders/shape.vert';
import fragSource from './shaders/shape.frag';

import { SceneObject, generateCubeVertices } from './shape';
import { menu } from './menu';

// Function to load an image from a URL
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = (_event) => resolve(image);
        image.onerror = (_event, _source, _lineno, _colno, err) => reject(err);
        image.src = url.href;
    });
}

// Initialize the canvas and WebGL context
const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.25, 0.25, 0.25, 1.0);
gl.enable(gl.DEPTH_TEST);

// Compile shaders and link the program
const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource);
const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
const shapeProgram = linkProgram(gl, vs, fs);

gl.useProgram(shapeProgram);

// Get uniform locations
const uModelLocation = gl.getUniformLocation(shapeProgram, 'uModel');
const uViewLocation = gl.getUniformLocation(shapeProgram, 'uView');
const uProjLocation = gl.getUniformLocation(shapeProgram, 'uProjection');
const uTextureLocation = gl.getUniformLocation(shapeProgram, 'uTexture'); // Texture uniform
const uTexOffsetLocation = gl.getUniformLocation(shapeProgram, 'uTexOffset'); // Texture offset uniform
const uTexScaleLocation = gl.getUniformLocation(shapeProgram, 'uTexScale'); // Texture scale uniform

// Buffer and vertex attributes
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, generateCubeVertices(), gl.STATIC_DRAW);

const F32 = Float32Array.BYTES_PER_ELEMENT;
const stride = F32 * 5; // Update stride to 5 for position (3) + texCoord (2)

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, F32 * 0); // Position
gl.enableVertexAttribArray(0);

gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, F32 * 3); // TexCoord
gl.enableVertexAttribArray(1); // Enable the texture coordinate attribute

let imgW = 1;
let imgH = 1;
const cube = new SceneObject();

// Change to the terrain texture atlas
const imageUrl = new URL('./textures/terrain.png', import.meta.url);

loadImage(imageUrl).then(image => {
    imgW = image.width;
    imgH = image.height;

    // Create and bind the texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fix the upside-down texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Flip texture vertically

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // Minification filter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // Magnification filter

    // Upload the image data to the GPU
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D); // Generate mipmaps for the texture
});

// Draw function
function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (menu.rotateX.checked) cube.rotation.x += 0.0056;
    if (menu.rotateY.checked) cube.rotation.y += 0.0064;
    if (menu.rotateZ.checked) cube.rotation.z += 0.0048;

    const cameraPosition = vec3(0, 0, 2.25);
    const cameraTarget = vec3(0, 0, 0);

    const modelMatrix = cube.getModelMatrix();
    const viewMatrix = lookAtMatrix(cameraPosition, cameraTarget);
    const projMatrix = perspectiveMatrix(radians(45), canvas.width / canvas.height, 0.1, 100);

    gl.uniformMatrix4fv(uViewLocation, false, viewMatrix.flat());
    gl.uniformMatrix4fv(uProjLocation, false, projMatrix.flat());
    gl.uniformMatrix4fv(uModelLocation, false, modelMatrix.flat());
    gl.uniform1i(uTextureLocation, 0); // Set the texture uniform to use texture unit 0

    // Retrieve and set the texture offset and scale from the menu
    const xOffset = menu.xOffset.valueAsNumber || 0;
    const yOffset = menu.yOffset.valueAsNumber || 0;
    const xScale = menu.xScale.valueAsNumber || 1;
    const yScale = menu.yScale.valueAsNumber || 1;

    gl.uniform2f(uTexOffsetLocation, xOffset, yOffset); // Set texture offset
    gl.uniform2f(uTexScaleLocation, xScale, yScale);   // Set texture scale

    gl.drawArrays(gl.TRIANGLES, 0, 36); // Draw the cube with current vertex data

    window.requestAnimationFrame(draw);
}

draw();
