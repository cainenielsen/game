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

class Tile extends Entity {
    constructor({ height, width, setPosition, texture = 'dirt' }) {
        super({ height, width, setPosition });
        this.sprite = textures[texture];
        this.gridDisplay();
    }
    draw() {
        level1.context.drawImage(this.sprite.img, this.bounding.leftX, this.bounding.topY, level1.config.gridSize, level1.config.gridSize);
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
