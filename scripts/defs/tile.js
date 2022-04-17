const textures = {
    dirt: 'assets/dirt.png'
}

const img = new Image();

class Tile2 extends Entry {
    constructor({ height, width, setPosition, background }) {
        super({ height, width, setPosition, background });
        this.background = function () {
            img.src = textures['dirt'];
            level1.context.drawImage(img, this.bounding.leftX, this.bounding.topY, level1.config.gridSize, level1.config.gridSize);
            if (level1.config.gridDisplay) {
                level1.context.fillStyle = 'white';
                level1.context.fillText(`x: ${this.bounding.leftX / level1.config.gridSize}`, this.bounding.leftX, this.bounding.topY + 10);
                level1.context.fillText(`y: ${this.bounding.topY / level1.config.gridSize}`, this.bounding.leftX, this.bounding.topY + 20);
            }
        }
    }
}
