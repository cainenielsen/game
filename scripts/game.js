const myGame = new Game();

const level1 = new Level({ name: 'level_one', gridDisplay: false, startingPosition: { x: 2, y: 12 } });

myGame.levels.push(level1);

const startButton = document.getElementById("start");
startButton.addEventListener("click", () => myGame.start());

const toggleButton = document.getElementById("toggle");
toggleButton.addEventListener("click", () => level1.toggle());

let selectedTile = 'dirt';

const dirtButton = document.getElementById("dirt");
dirtButton.addEventListener("click", () => {
    selectedTile = 'dirt';
    console.log(selectedTile);
});

const spaceButton = document.getElementById("space");
spaceButton.addEventListener("click", () => {
    selectedTile = 'space';
    console.log(selectedTile);
});

const drawTile = (xPos, yPos) => {
    level1.tiles.push({
        x: xPos,
        y: yPos,
        texture: selectedTile
    });
    // console.log(JSON.stringify(level1.tiles));
};

const clearTile = (tileIndexMatchingPosition) => {
    delete level1.tiles[tileIndexMatchingPosition];
    // console.log(JSON.stringify(level1.tiles));
}

level1.canvas.addEventListener("mousedown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    const currentMatrix = level1.context.getTransform();
    const translatedX = currentMatrix.e;
    const translatedY = currentMatrix.f;
    const elementRelativeX = event.clientX - translatedX;
    const elementRelativeY = event.clientY - translatedY;
    const xPos = Math.trunc(elementRelativeX / level1.config.gridSize);
    const yPos = Math.trunc(elementRelativeY / level1.config.gridSize);
    const tileIndexMatchingPosition = level1.tiles.findIndex((tile) => tile.x === xPos && tile.y === yPos);
    if (event.button === 0) {
        event.preventDefault();
        if (tileIndexMatchingPosition < 0) {
            drawTile(xPos, yPos);
        }
    }
    if (event.button === 2) {
        event.preventDefault();
        if (tileIndexMatchingPosition > -1) {
            clearTile(tileIndexMatchingPosition);
        }
    }
}, false);

// ensure we don't open the context menu when clicking on the canvas
level1.canvas.addEventListener("contextmenu", e => e.preventDefault());

const somePlayer = new Player({ setPosition: { x: 2, y: 12, useGrid: true }, height: 4, width: 2 });

level1.player = somePlayer;
