const level1 = new Level({ name: 'level_one', gridDisplay: false, startingPosition: { x: 2, y: 12 } });

const pushTile = (x, y, texture) => {
    level1.entries.push(new Tile({ setPosition: { x, y, useGrid: true }, texture }));
};

const pushDirt = (x, y) => {
    pushTile(x, y, dirt);
}

const pushSpace = (x, y) => {
    pushTile(x, y, space);
}

const toggleButton = document.getElementById("toggle");
toggleButton.addEventListener("click", () => level1.toggle());

pushDirt(0, 30);
pushDirt(0, 31);
pushDirt(0, 32);
pushDirt(1, 30);
pushDirt(1, 31);
pushDirt(1, 32);
pushDirt(2, 30);
pushDirt(2, 31);
pushDirt(2, 32);
pushSpace(3, 30);
pushSpace(3, 31);
pushSpace(3, 32);
pushSpace(4, 30);
pushSpace(4, 31);
pushSpace(4, 32);
pushSpace(5, 30);
pushSpace(5, 31);
pushSpace(5, 32);
pushSpace(6, 30);
pushSpace(6, 31);
pushSpace(6, 32);
pushSpace(7, 30);
pushSpace(7, 31);
pushSpace(7, 32);
pushSpace(8, 30);
pushSpace(8, 31);
pushSpace(8, 32);
pushSpace(9, 30);
pushSpace(9, 31);
pushSpace(9, 32);
pushSpace(10, 30);
pushSpace(10, 31);
pushSpace(10, 32);
pushSpace(11, 30);
pushSpace(11, 31);
pushSpace(11, 32);
pushSpace(12, 30);
pushSpace(12, 31);
pushSpace(12, 32);
pushSpace(13, 30);
pushSpace(13, 31);
pushSpace(13, 32);
pushSpace(14, 30);
pushSpace(14, 31);
pushSpace(14, 32);
pushSpace(15, 30);
pushSpace(15, 31);
pushSpace(15, 32);
pushSpace(16, 30);
pushSpace(16, 31);
pushSpace(16, 32);
pushSpace(17, 30);
pushSpace(17, 31);
pushSpace(17, 32);
pushSpace(18, 30);
pushSpace(18, 31);
pushSpace(18, 32);
pushSpace(19, 30);
pushSpace(19, 31);
pushSpace(19, 32);
pushSpace(22, 30);
pushSpace(21, 30);
pushSpace(20, 30);
pushSpace(22, 31);
pushSpace(21, 31);
pushSpace(20, 31);
pushSpace(22, 32);
pushSpace(21, 32);
pushSpace(20, 32);
pushSpace(23, 30);
pushSpace(23, 31);
pushSpace(23, 32);
pushSpace(24, 30);
pushSpace(24, 31);
pushSpace(24, 32);
pushSpace(25, 30);
pushSpace(25, 31);
pushSpace(25, 32);
pushSpace(26, 30);
pushSpace(26, 31);
pushSpace(26, 32);

// repeat((i) => {
//     repeat((j) => {
//         if(j > 40) {
//             pushDirt(i, j);
//         }
//     }, level1.config.gridHeight);
// }, level1.config.gridWidth);


const somePlayer = new Player({ setPosition: { x: 2, y: 12, useGrid: true }, height: 4, width: 2});
