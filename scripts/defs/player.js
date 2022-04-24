class Player extends Character {
    constructor({ height, width, setPosition, background, maxSpeed }) {
        super({ height, width, setPosition, background, maxSpeed });
        this.background = function () {
            level1.context.fillStyle = 'red';
            level1.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.width, this.dimensions.height);
        }
        this.movement = {
            left: false,
            right: false,
            jump: false,
        };
        this.watch();
    }
    watch() {
        document.addEventListener('render', (e) => {
            this.handleWalk(e);
            this.handleJump(e);
        }, false);
    }
    handleWalk(e) {
        this.lastTime = 0;
        const fps = 1 / ( (performance.now() - e.detail.timestamp) / 1000 );
        this.lastTime = e.timestamp;
        level1.context.fillStyle = 'white';
        level1.context.fillText(Math.trunc(fps), this.bounding.leftX + 10, this.bounding.topY + 10);
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
