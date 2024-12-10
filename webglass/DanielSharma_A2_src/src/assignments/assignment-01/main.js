import { Cube } from './cube.js';     
import { Pyramid } from './pyramid.js'; 
import vertSource from './shaders/shape.vert';  
import fragSource from './shaders/shape.frag';  

function main() {
    const canvas = document.querySelector('canvas');
    canvas.width = 512;  
    canvas.height = 512; 
    const gl = canvas.getContext('webgl2');

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.7, 0.7, 0.7, 1.0);

    const shaderProgram = initShaderProgram(gl, vertSource, fragSource);
    gl.useProgram(shaderProgram);

    const cube1 = new Cube(gl);
    const cube2 = new Cube(gl);
    const pyramid1 = new Pyramid(gl);
    const pyramid2 = new Pyramid(gl);

    let lastTime = 0;

    function render(time) {
        const deltaTime = time - lastTime;
        lastTime = time;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        cube1.update(deltaTime);
        cube1.position.x = Math.sin(time * 0.0007) * 0.9;  
        cube1.scale.x = 0.7 + Math.sin(time * 0.0015) * 0.1;  
        cube1.scale.y = 0.7 + Math.sin(time * 0.0015) * 0.1;
        cube1.scale.z = 0.7 + Math.sin(time * 0.0015) * 0.1;
        cube1.render(shaderProgram);

        cube2.update(deltaTime);
        cube2.position.y = Math.sin(time * 0.001) * 0.9;  
        cube2.scale.x = 0.6 + Math.sin(time * 0.002) * 0.3;  
        cube2.scale.y = 0.6 + Math.sin(time * 0.002) * 0.3;
        cube2.scale.z = 0.6 + Math.sin(time * 0.002) * 0.3;
        cube2.render(shaderProgram);

        pyramid1.update(deltaTime);
        pyramid1.position.x = Math.cos(time * 0.0008) * 0.9;  
        pyramid1.position.y = Math.sin(time * 0.0008) * 0.9;
        pyramid1.scale.x = 0.5 + Math.sin(time * 0.0012) * 0.2;  
        pyramid1.scale.y = 0.5 + Math.sin(time * 0.0012) * 0.2;
        pyramid1.scale.z = 0.5 + Math.sin(time * 0.0012) * 0.2;
        pyramid1.render(shaderProgram);

        pyramid2.update(deltaTime);
        pyramid2.position.x = -Math.cos(time * 0.0008) * 0.9;  
        pyramid2.position.y = -Math.sin(time * 0.0008) * 0.9;
        pyramid2.scale.x = 0.6 + Math.cos(time * 0.0015) * 0.3;  
        pyramid2.scale.y = 0.6 + Math.cos(time * 0.0015) * 0.3;
        pyramid2.scale.z = 0.6 + Math.cos(time * 0.0015) * 0.3;
        pyramid2.render(shaderProgram);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
}

function initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;
}

main();
