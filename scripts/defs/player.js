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
        // if(this.bottomImpacts.length > 0) {
        //     level1.context.fillStyle = 'yellow';
        // } else {
        //     level1.context.fillStyle = 'purple';
        // }
        // level1.context.fillRect(this.impactBounding.leftX, this.impactBounding.topY, this.impactDimensions.width, this.impactDimensions.height);
        level1.context.fillStyle = 'red';
        level1.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.width, this.dimensions.height);
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
