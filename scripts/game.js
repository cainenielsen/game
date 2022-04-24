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

level1.canvas.addEventListener("mousedown", function (e) {
    const currentMatrix = level1.context.getTransform();
    const translatedX = currentMatrix.e;
    const translatedY = currentMatrix.f;
    const elementRelativeX = e.clientX - translatedX;
    const elementRelativeY = e.clientY - translatedY;
    const xPos = Math.trunc(elementRelativeX / level1.config.gridSize);
    const yPos = Math.trunc(elementRelativeY / level1.config.gridSize);
    const tileMatchingPosition = level1.tiles.find((tile) => tile.x === xPos && tile.y === yPos);
    if(!tileMatchingPosition) {
        level1.tiles.push({
            x: xPos,
            y: yPos,
            texture: selectedTile
        });
        // console.log(JSON.stringify(level1.tiles));
    }
}, false);

const somePlayer = new Player({ setPosition: { x: 2, y: 12, useGrid: true }, height: 4, width: 2 });

level1.player = somePlayer;
