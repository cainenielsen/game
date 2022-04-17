class Player extends Character {
    constructor({ height, width, setPosition, background, maxSpeed }) {
        super({ height, width, setPosition, background, maxSpeed });
        this.background = function () {
            level1.context.fillStyle = 'red';
            level1.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.height, this.dimensions.width);
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
            this.camera(e);
            this.movePlayer(e);
            this.handleJump(e);
        }, false);
    }
    camera() {
        const halfPlayer = level1.config.gridSize / 2;
        const halfScreenWidth = window.innerWidth / 2;
        const halfScreenHeight = window.innerHeight / 2;
        const formattedPlayerDistanceFromLeft = 0 - this.bounding.leftX - halfPlayer + halfScreenWidth;
        const formattedPlayerDistanceFromTop = 0 - this.bounding.topY - halfPlayer + halfScreenHeight;
        let clampedDistanceFromLeft = formattedPlayerDistanceFromLeft;
        let clampedDistanceFromTop = formattedPlayerDistanceFromTop;

        // horizontal clamps
        if (clampedDistanceFromLeft > 0) {
            clampedDistanceFromLeft = 0;
        }
        if (Math.abs(clampedDistanceFromLeft) > level1.canvas.width - window.innerWidth) {
            clampedDistanceFromLeft = 0 - level1.canvas.width + window.innerWidth;
        }
        // vertical clamps
        if (clampedDistanceFromTop > 0) {
            clampedDistanceFromTop = 0;
        }
        if (Math.abs(clampedDistanceFromTop) > level1.canvas.height - window.innerHeight) {
            clampedDistanceFromTop = 0 - level1.canvas.height + window.innerHeight;
        }

        level1.canvas.style.left = `${clampedDistanceFromLeft}px`;
        level1.canvas.style.top = `${clampedDistanceFromTop}px`
    };
    movePlayer() {
        const isLeftCollided = this.leftCollisions.length > 0;
        const isRightCollided = this.rightCollisions.length > 0;

        if (isLeftCollided) {
            this.velocity.horizontal = 0;
            this.setPosition({ x: this.leftCollisions[0].tile.bounding.rightX });
        }

        if (isRightCollided) {
            this.velocity.horizontal = 0;
            this.setPosition({ x: this.rightCollisions[0].tile.bounding.leftX - this.dimensions.width });
        }

        if (Math.abs(this.velocity.horizontal) < this.maxSpeed) {
            if (this.movement.left) {
                if (this.bounding.leftX > 0) {
                    if (!isLeftCollided) {
                        this.velocity.horizontal--;
                    }
                }
            }
            if (this.movement.right) {
                if (this.bounding.rightX < level1.canvas.width) {
                    if (!isRightCollided) {
                        this.velocity.horizontal++;
                    }
                }
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
