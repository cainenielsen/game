import Entity from './entity.js';

class Texture {
    constructor(resourcePath) {
        this.img = new Image();
        this.img.src = resourcePath;
    }
}

const textures = {
    dirt: new Texture('assets/norzeteus-space-1-18-2/assets/minecraft/textures/block/dirt.png'),
    space: new Texture('assets/norzeteus-space-1-18-2/assets/minecraft/textures/block/iron_block2.png'),
    andesite: new Texture('assets/norzeteus-space-1-18-2/assets/minecraft/textures/block/andesite.png')
};

export default class Tile extends Entity {
    constructor({ height, width, setPosition, texture = 'dirt' }, level) {
        super({ height, width, setPosition }, level);
        this.sprite = textures[texture];
        this.drawn = false;
        this.gridDisplay();
    }
    draw() {
        if (this.drawn === false) {
            console.log('draw');
            this.drawn = true;
            this.level.layers.tiles.context.drawImage(this.sprite.img, this.bounding.leftX, this.bounding.topY, this.level.config.gridSize, this.level.config.gridSize);
        }
    }
    clear() {
        if (this.drawn === true) {
            console.log('clear');
            this.drawn = false;
            this.level.layers.tiles.context.clearRect(this.sprite.img, this.bounding.leftX, this.bounding.topY, this.level.config.gridSize, this.level.config.gridSize);
        }
    }
    gridDisplay() {
        if (this.level.config.gridDisplay) {
            this.level.context.font = "20px san-serif";
            this.level.context.fillStyle = 'white';
            this.level.context.fillText(`x: ${this.bounding.leftX / this.level.config.gridSize}`, this.bounding.leftX, this.bounding.topY + 20);
            this.level.context.fillText(`y: ${this.bounding.topY / this.level.config.gridSize}`, this.bounding.leftX, this.bounding.topY + 40);
        }
    };
}
