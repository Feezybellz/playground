import { initCanvas } from 'mv-redux/init';
import { radians } from 'mv-redux';

import { Pyramid } from './pyramid';
import { menu, vec3FromSliders } from './menu';

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.6, 0.6, 0.6, 1.0);
gl.enable(gl.DEPTH_TEST);


const pyramid = new Pyramid(gl);


function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    pyramid.position = vec3FromSliders(menu.position);
    pyramid.rotation = radians(vec3FromSliders(menu.rotation));
    pyramid.scale = vec3FromSliders(menu.scale);

    pyramid.draw();
    window.requestAnimationFrame(draw);
}

draw();
