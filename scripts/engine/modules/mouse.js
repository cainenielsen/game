const mouseModule = (level, player, handler) => {
    const defaultHandler = (event) => {
        console.log('default mouse handler', event);
    };

    // add mouse event handlers to the level
    level.mouseDownHandler = handler || defaultHandler;

    // set up mouse event listeners
    level.canvas.addEventListener("mousedown", (e) => level.mouseDownHandler(e, level, player), false);

    // ensure we don't open the context menu when clicking on the element
    level.canvas.addEventListener("contextmenu", e => e.preventDefault(), false);
}

export default mouseModule;
