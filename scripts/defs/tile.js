class Texture {
    constructor(resourcePath) {
        this.img = new Image();
        this.img.src = resourcePath;
    }
}

const dirt = new Texture('assets/dirt.png');
const space = new Texture('assets/space-tile.jpg');

class Tile extends Entry {
    constructor({ height, width, setPosition, texture = dirt }) {
        super({ height, width, setPosition, background: texture });
        this.background = function () {
            level1.context.drawImage(texture.img, this.bounding.leftX, this.bounding.topY, level1.config.gridSize, level1.config.gridSize);
        }
        this.gridDisplay();
    }
    gridDisplay() {
        if (level1.config.gridDisplay) {
            level1.context.font = "20px san-serif";
            level1.context.fillStyle = 'white';
            level1.context.fillText(`x: ${this.bounding.leftX / level1.config.gridSize}`, this.bounding.leftX, this.bounding.topY + 20);
            level1.context.fillText(`y: ${this.bounding.topY / level1.config.gridSize}`, this.bounding.leftX, this.bounding.topY + 40);
        }
    };
}
