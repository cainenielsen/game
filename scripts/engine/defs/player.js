import Character from './character.js';

export default class Player extends Character {
    constructor({ height, width, setPosition, maxSpeed }, level) {
        super({ height, width, setPosition, maxSpeed }, level);
        this.movement = {
            left: false,
            right: false,
            jump: false,
        };
        this.facing = 'right';
        this.selectedTile = 'dirt';
    }
    animate() {
        this.handleWalk();
        this.handleJump();
        this.level.layers.characters.context.fillStyle = 'tan';
        this.level.layers.characters.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.width, this.dimensions.height);
        if (this.facing === 'left') {
            this.level.layers.characters.context.fillStyle = 'red';
            this.level.layers.characters.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.width / 2, this.dimensions.height);
        }
        if (this.facing === 'right') {
            this.level.layers.characters.context.fillStyle = 'blue';
            this.level.layers.characters.context.fillRect(this.bounding.leftX + this.dimensions.width / 2, this.bounding.topY, this.dimensions.width / 2, this.dimensions.height);
        }

    }
    handleWalk() {
        if (Math.abs(this.velocity.horizontal) < this.maxSpeed) {
            if (this.movement.left) {
                this.velocity.horizontal--;
                this.facing = 'left';
            }
            if (this.movement.right) {
                this.velocity.horizontal++;
                this.facing = 'right';
            }
        }
    }
    handleJump() {
        if (this.movement.jump && this.jumping === false) {
            if (this.velocity.vertical === 0) {
                this.jumping = true;
                this.velocity.vertical = -20;
            }
        }
    };
}
