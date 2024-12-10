import './menu.css';

/**
 * Helper function to grab an input from the DOM so I don't have to write out so many huge casts or
 * type `document.getElementById` so many times.
 * @param {string} id
 */
function getInput(id) {
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

export const menu = {
    xOffset: getInput('tex-x-offset'),
    yOffset: getInput('tex-y-offset'),
    xScale: getInput('tex-x-scale'),
    yScale: getInput('tex-y-scale'),
    rotateX: getInput('rotate-x'),
    rotateY: getInput('rotate-y'),
    rotateZ: getInput('rotate-z'),
}
