const mouseModule = (level, player, handler) => {
    const defaultHandler = (event) => {
        console.log('default mouse handler', event);
    };

    // add mouse event handlers to the level
    level.mouseDownHandler = handler || defaultHandler;

    // set up mouse event listeners
    level.container.addEventListener("mousedown", (e) => level.mouseDownHandler(e, level, player), false);
}

export default mouseModule;
