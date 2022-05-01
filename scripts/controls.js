class KeyHandler {
    constructor(downCallback = () => {}, upCallback = () => {}, pressCallback = () => {}) {
        this.downCallback = downCallback;
        this.upCallback = upCallback;
        this.pressCallback = pressCallback;
    }
    handleKeyDown = (player) => this.downCallback(player);
    handleKeyUp = (player) => this.upCallback(player);
    handleKeyPress = (player) => this.pressCallback(player);
}

const handleUp = new KeyHandler(
    (player) => player.movement.jump = true,
    (player) => player.movement.jump = false
);

const handleDown = new KeyHandler(
    () => console.log('crouch'),
    () => console.log('crouch')
);

const handleLeft = new KeyHandler(
    (player) => player.movement.left = true,
    (player) => player.movement.left = false
);

const handleRight = new KeyHandler(
    (player) => player.movement.right = true,
    (player) => player.movement.right = false
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



const keyDownHandler = (event, player) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (keyCodes[event.code]) {
        // console.log(event.key);
        keyCodes[event.code].handleKeyDown(player);

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
};

const keyUpHandler = (event, player) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (keyCodes[event.code]) {
        // console.log(event.key);
        keyCodes[event.code].handleKeyUp(player);

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
};

// mainly used for typeable characters
const keyPressHandler = (event, player) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (keyCodes[event.code]) {
        // console.log(event.key);
        keyCodes[event.code].handleKeyPress(player);

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
};

// mouse controls

const drawTile = (xPos, yPos, level, player) => {
    level.tiles.push({
        x: xPos,
        y: yPos,
        texture: player.selectedTile
    });
};

const clearTile = (tileIndexMatchingPosition, level) => {
    delete level.tiles[tileIndexMatchingPosition];
}

const mouseHandler = (event, level, player) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    const currentMatrix = level.context.getTransform();
    const translatedX = currentMatrix.e;
    const translatedY = currentMatrix.f;
    const elementRelativeX = event.clientX - translatedX;
    const elementRelativeY = event.clientY - translatedY;
    const xPos = Math.trunc(elementRelativeX / level.config.gridSize);
    const yPos = Math.trunc(elementRelativeY / level.config.gridSize);
    const tileIndexMatchingPosition = level.tiles.findIndex((tile) => tile.x === xPos && tile.y === yPos);
    if (event.button === 0) {
        event.preventDefault();
        if (tileIndexMatchingPosition < 0) {
            drawTile(xPos, yPos, level, player);
        }
    }
    if (event.button === 2) {
        event.preventDefault();
        if (tileIndexMatchingPosition > -1) {
            clearTile(tileIndexMatchingPosition, level);
        }
    }
}

export {
    mouseHandler,
    keyDownHandler,
    keyUpHandler,
    keyPressHandler
}
