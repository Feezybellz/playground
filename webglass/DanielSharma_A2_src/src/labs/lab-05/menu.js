import { vec3 } from 'mv-redux';

/**
 * Helper function to grab an input from the DOM so I don't have to write out so many huge casts or
 * type `document.getElementById` so many times.
 * @param {string} id
 * @returns {HTMLInputElement}
 */
function getInput(id) {
    const element = document.getElementById(id);
    if (element instanceof HTMLInputElement) return element;
    else throw new Error(`Element #${id} is not an <input>.`);
}

/**
 * @typedef SliderGroup
 * @property {HTMLInputElement} x
 * @property {HTMLInputElement} y
 * @property {HTMLInputElement} z
 */

/**
 * Generates a `vec3` from a group of three sliders.
 * @param {SliderGroup} inputs The x, y, and z sliders to grab the vector components from.
 * @returns {import('mv-redux').Vec3} The vector.
 */
export function vec3FromSliders({ x, y, z }) {
    return vec3(
        x.valueAsNumber || 0,
        y.valueAsNumber || 0,
        z.valueAsNumber || 0,
    );
}

export const menu = {
    position: { x: getInput('px'), y: getInput('py'), z: getInput('pz') },
    rotation: { x: getInput('rx'), y: getInput('ry'), z: getInput('rz') },
    scale: { x: getInput('sx'), y: getInput('sy'), z: getInput('sz') },
};
