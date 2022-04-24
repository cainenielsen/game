class Player extends Character {
    constructor({ height, width, setPosition, maxSpeed }) {
        super({ height, width, setPosition, maxSpeed });
        this.movement = {
            left: false,
            right: false,
            jump: false,
        };
        this.watch();
    }
    draw(e) {
        level1.context.fillStyle = 'red';
        level1.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.width, this.dimensions.height);
        this.lastTime = 0;
        const fps = 1 / ( (performance.now() - e.detail.timestamp) / 1000 );
        this.lastTime = e.timestamp;
        level1.context.fillStyle = 'white';
        level1.context.fillText(Math.trunc(fps), this.bounding.leftX + 10, this.bounding.topY + 10);
    }
    watch() {
        document.addEventListener('render', (e) => {
            this.handleWalk(e);
            this.handleJump(e);
            this.draw(e);
        }, false);
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
        this.move({ x: this.friction });
    }
    handleJump() {
        if (this.movement.jump && this.jumping === false) {
            if (this.velocity.vertical === 0) {
                this.jumping = true;
                this.velocity.vertical = -80;
            }
        }
    };
}
