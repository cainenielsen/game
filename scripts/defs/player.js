class Player extends Character {
    constructor({ height, width, setPosition, maxSpeed }) {
        super({ height, width, setPosition, maxSpeed });
        this.movement = {
            left: false,
            right: false,
            jump: false,
        };
    }
    animate(e) {
        this.handleWalk(e);
        this.handleJump(e);
        level1.context.fillStyle = 'red';
        level1.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.width, this.dimensions.height);
    }
    handleWalk(e) {
        if (Math.abs(this.velocity.horizontal) < this.maxSpeed) {
            if (this.movement.left) {
                this.velocity.horizontal--;
            }
            if (this.movement.right) {
                this.velocity.horizontal++;
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
