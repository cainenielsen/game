const level1 = new Level({ name: 'level_one', gridDisplay: true, highlightCollisions: true, startingPosition: { x: 2, y: 12 } });
const somePlayer = new Player({ setPosition: { x: 2, y: 12, useGrid: true }, height: 4, width: 2});

level1.player = somePlayer;

level1.addTiles(tiles);

const toggleButton = document.getElementById("toggle");
toggleButton.addEventListener("click", () => level1.toggle());

// repeat((i) => {
//     repeat((j) => {
//         if(j > 40) {
//             addTileToList(i, j);
//         }
//     }, level1.config.gridHeight);
// }, level1.config.gridWidth);
