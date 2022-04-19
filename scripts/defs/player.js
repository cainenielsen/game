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
            this.camera(e);
            this.handleWalk(e);
            this.handleJump(e);
        }, false);
    }
    get cameraXOffset() {
        return 0 - this.bounding.leftX - this.halfWidth + level1.halfScreenWidth;
    }
    get cameraYOffset() {
        return 0 - this.bounding.topY - this.halfHeight + level1.halfScreenHeight;
    }
    camera() {
        let clampedDistanceFromLeft = this.cameraXOffset;
        let clampedDistanceFromTop = this.cameraYOffset;

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
        level1.canvas.style.top = `${clampedDistanceFromTop}px`;
    };
    handleWalk() {
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
