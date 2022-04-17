class KeyHandler {
    constructor(downCallback = () => {}, upCallback = () => {}, pressCallback = () => {}) {
        this.downCallback = downCallback;
        this.upCallback = upCallback;
        this.pressCallback = pressCallback;
    }
    handleKeyDown = () => this.downCallback();
    handleKeyUp = () => this.upCallback();
    handleKeyPress = () => this.pressCallback();
}

const handleUp = new KeyHandler(
    () => somePlayer.movement.jump = true,
    () => somePlayer.movement.jump = false
);

const handleDown = new KeyHandler(
    () => console.log('crouch'),
    () => console.log('crouch')
);

const handleLeft = new KeyHandler(
    () => somePlayer.movement.left = true,
    () => somePlayer.movement.left = false
);

const handleRight = new KeyHandler(
    () => somePlayer.movement.right = true,
    () => somePlayer.movement.right = false
);

const keyCodes = {
    ArrowDown: handleDown,
    ArrowUp: handleUp,
    ArrowLeft: handleLeft,
    ArrowRight: handleRight,
    KeyS: handleDown,
    KeyW: handleUp,
    KeyA: handleLeft,
    KeyD: handleRight,
    Space: handleUp
}

const keyDownHandler = (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (keyCodes[event.code]) {
        // console.log(event.key);
        keyCodes[event.code].handleKeyDown();

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
};

const keyUpHandler = (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (keyCodes[event.code]) {
        // console.log(event.key);
        keyCodes[event.code].handleKeyUp();

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
};

// mainly used for typeable characters
const keyPressHandler = (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (keyCodes[event.code]) {
        // console.log(event.key);
        keyCodes[event.code].handleKeyPress();

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
};

window.addEventListener("keydown", keyDownHandler, true);
window.addEventListener("keyup", keyUpHandler, true);
window.addEventListener("keypress", keyPressHandler, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window
