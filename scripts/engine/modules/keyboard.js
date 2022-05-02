const keyboardModule = (level, player, handlers) => {
    const defaultHandler = (event) => {
        console.log('default keyboard handler', event);
    };

    // add keyboard event handlers to the level
    level.keyDownHandler = handlers.keyDownHandler || defaultHandler;
    level.keyUpHandler = handlers.keyUpHandler || defaultHandler;
    level.keyPressHandler = handlers.keyPressHandler || defaultHandler;

    // setup keyboard event listeners
    level.container.addEventListener("keydown", (e) => level.keyDownHandler(e, player), true);
    level.container.addEventListener("keyup", (e) => level.keyUpHandler(e, player), true);
    level.container.addEventListener("keypress", (e) => level.keyPressHandler(e, player), true);
};

export default keyboardModule;
