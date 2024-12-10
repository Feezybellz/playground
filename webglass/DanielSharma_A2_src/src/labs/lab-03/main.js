import { initCanvas, compileShader, linkProgram } from 'mv-redux/init';
import { Triangle } from './triangle.js';

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.7, 0.7, 0.7, 1.0);


// Triangle initialization
// =================================================================================================

const t1 = new Triangle(gl);
const t2 = new Triangle(gl);
const t3 = new Triangle(gl);

/**
 * The main draw loop.
 *
 * @param {number} time The number of milliseconds that have passed since the page was loaded. This
 * parameter is passed automatically by `requestAnimationFrame` when it re-calls this function.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
 */
function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Triangle drawing
    t1.position[0] = Math.cos(time / 1000) * 0.6; 
    t1.position[1] = Math.sin(time / 1000) * 0.6; 
    t1.scale = Math.cos(time / 1000) * 0.10 + 0.30;

    t2.position[0] = 0.0; 
    t2.position[1] = 0.0;
    t2.scale = Math.cos(time / 500)* 0.10 + 0.30; 


    t3.position[0] = 0.6;
    t3.position[1] = 0.6;
    t3.scale = Math.cos(time / 900)* 0.50 + 0.10; 
    // =============================================================================================
t1.draw(gl);
t2.draw(gl);
t3.draw(gl);
    

    window.requestAnimationFrame(draw);
}

draw();
