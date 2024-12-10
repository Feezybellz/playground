import { Vec3, vec3 } from 'mv-redux';

/**
 * Helper function to grab an input from the DOM so I don't have to write out so many huge casts or
 * type `document.getElementById` so many times.
 */
function getInput(id: string): HTMLInputElement {
    const input = document.getElementById(id);

    if (!(input instanceof HTMLInputElement)) {
        throw new Error(`Element #${id} is not an <input>.`);
    }

    // See if the input has a span next to it, and attach a listener if it does
    const sibling = input.nextElementSibling;
    if (sibling instanceof HTMLSpanElement) {
        input.addEventListener('input', () => {
            sibling.innerText = input.valueAsNumber.toFixed(2)
        });
    }

    return input;
}


interface SliderGroup {
    x: HTMLInputElement,
    y: HTMLInputElement,
    z: HTMLInputElement,
}


export function vec3FromSliders({ x, y, z }: SliderGroup): Vec3 {
    return vec3(
        x.valueAsNumber || 0,
        y.valueAsNumber || 0,
        z.valueAsNumber || 0,
    );
}

export const menu = {
    cameraPosition: { x: getInput('cx'), y: getInput('cy'), z: getInput('cz') },
}
