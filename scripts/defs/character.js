class Character extends Entry {
    constructor({ height, width, setPosition, background, maxSpeed = 100 }) {
        super({ height, width, setPosition, background });
        this.maxSpeed = maxSpeed;
        this.jumping = false;
        this.collisions = [];
        this.velocity = {
            vertical: 0,
            horizontal: 0
        };
        this.init();
    }
    get gravity() {
        return this.velocity.vertical * 0.10;
    }
    get friction() {
        return this.velocity.horizontal * 0.10;
    }
    get collisionsBelowPlayer() {
        return this.collisions.filter((collision) => {
            return collision.centerPosition.y > this.bounding.bottomY
        });
    }
    get collisionsLeftOfPlayer() {
        return this.collisions.filter((collision) => {
            return collision.bounding.rightX < this.centerPosition.x &&
                collision.centerPosition.y < this.bounding.bottomY
        });
    }
    get collisionsRightOfPlayer() {
        return this.collisions.filter((collision) => {
            return collision.bounding.leftX > this.centerPosition.x &&
                collision.centerPosition.y < this.bounding.bottomY
        });
    }
    init() {
        document.addEventListener('render', (e) => {
            this.handleStageLimits(e);
            this.playerTileCollision(e);
            this.handleGravity(e);
            this.handleVelocityEntropy(e);
        }, false);
    }
    handleGravity() {
        this.move({ y: this.gravity });
        const fall = () => {
            this.velocity.vertical++;
        };

        const land = (yPosition) => {
            if (this.velocity.vertical > 0) {
                this.velocity.vertical = 0;
                this.setPosition({ y: yPosition - this.dimensions.height });
                this.jumping = false;
            }
        };

        const isOnTile = this.collisionsBelowPlayer.length > 0;

        const isInCanvas = this.bounding.bottomY < level1.canvas.height;

        if (isOnTile) {
            land(this.collisionsBelowPlayer[0].bounding.topY);
        } else {
            if (isInCanvas) {
                fall();
            } else {
                this.setPosition({ x: level1.config.startingPosition.x, y: level1.config.startingPosition.y });
                land(level1.canvas.height);
            }
        }
    }
    playerTileCollision() {
        level1.entries.forEach((tile) => {
            if (detectCollision(tile.bounding, this.bounding)) {
                if (!this.collisions.find((collision) => collision.id === tile.id)) {
                    this.collisions.push(tile);
                }
            } else {
                this.collisions = this.collisions.filter((collision) => collision.id !== tile.id);
            }
        });
    };
    handleStageLimits() {
        if (this.bounding.leftX >= 0) {
            if (this.bounding.leftX <= level1.canvas.width - this.dimensions.width) {
                this.bounding.leftX = this.bounding.leftX + this.friction;
            } else {
                this.bounding.leftX = level1.canvas.width - this.dimensions.width;
            }
        } else {
            this.setPosition({ x: 0 });
        }
    };
    handleVelocityEntropy() {
        if (Math.abs(this.velocity.horizontal) >= 0.1) {
            this.velocity.horizontal = this.velocity.horizontal * 0.98;
        } else {
            this.velocity.horizontal = 0;
        }
    };
}
