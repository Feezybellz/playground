import { initCanvas } from 'mv-redux/init';
import { vec2, vec3, mult, radians } from 'mv-redux';

import { Square } from './square';

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.4, 0.4, 0.4, 1.0);

// ----------------------------------------------------------------------------

const square1 = new Square(gl, {
    color: mult(vec3(0x3E, 0x9B, 0xED), 1 / 255),
    scale: vec2(0.25),
});

const square2 = new Square(gl, {
    color: mult(vec3(0x66, 0x33, 0x99), 1 / 255),
    scale: vec2(0.15),
});

// ----------------------------------------------------------------------------

const rotationButton = /** @type {HTMLButtonElement} */ (document.getElementById('rotation'));
const speedInput = /** @type {HTMLInputElement} */ (document.getElementById('speed'));
const xSlider = /** @type {HTMLInputElement} */ (document.getElementById('xSlider'));
const ySlider = /** @type {HTMLInputElement} */ (document.getElementById('ySlider'));

let isSpinning = true;

//event listener
rotationButton.addEventListener('click', () => {isSpinning = !isSpinning});
canvas.addEventListener('mousedown', event => {
    if (event.button !== 0) return;

    // Get the canvas's size and position +
    //links clientx property https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    
    const webGLX = (mouseX / canvas.width) * 2 - 1;
    const webGLY = 1 - (mouseY / canvas.height) * 2;


    square2.position = vec2(webGLX, webGLY);  
});



// ----------------------------------------------------------------------------

function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    //getting input speed
    const speed = Number(speedInput.value);
    square1.position[0] = Number(xSlider.value); 
    square1.position[1] = Number(ySlider.value); // Step 2sssssssss



    if(isSpinning) {
    square1.rotation += radians( speed );
    square2.rotation -= radians(speed);
    }

    square1.draw();
    square2.draw();

    window.requestAnimationFrame(draw);
}

draw();
