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
    get leftCollisions() {
        return this.collisions.filter((collision) => collision.side === 'left' && collision.tile.bounding.topY < this.bounding.bottomY);
    }
    get rightCollisions() {
        return this.collisions.filter((collision) => collision.side === 'right' && collision.tile.bounding.topY < this.bounding.bottomY);
    }
    get topCollisions() {
        return this.collisions.filter((collision) => collision.side === 'top');
    }
    get bottomCollisions() {
        return this.collisions.filter((collision) => collision.side === 'bottom');
    }
    init() {
        document.addEventListener('render', (e) => {
            this.handleStageLimits(e);
            this.playerTileCollision(e);
            this.handleGravity(e);
            this.handleVelocityEntropy(e);
            this.highlightCollisions(e);
        }, false);
    }
    handleGravity() {
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

        const isUnderTile = this.topCollisions.length > 0;

        if (isUnderTile) {
            this.velocity.vertical = 0;
            this.setPosition({ y: this.topCollisions[0].tile.bounding.bottomY });
        }

        const isOnTile = this.bottomCollisions.length > 0;
        const isInCanvas = this.bounding.bottomY < level1.canvas.height;

        if (isOnTile) {
            land(this.bottomCollisions[0].tile.bounding.topY);
        } else {
            if (isInCanvas) {
                fall();
            } else {
                this.setPosition({ x: level1.config.startingPosition.x, y: level1.config.startingPosition.y });
                land(level1.canvas.height);
            }
        }
        this.move({ y: this.gravity });
    }
    playerTileCollision() {
        level1.entries.forEach((tile) => {
            const collide = detectCollision2(tile, this)
            if (collide !== 'none') {
                if (!this.collisions.find((collision) => collision.tile.id === tile.id)) {
                    this.collisions.push({ tile, side: collide });
                }
            } else {
                this.collisions = this.collisions.filter((collision) => collision.tile.id !== tile.id);
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
    highlightCollisions() {
        console.log(this.collisions);
        this.leftCollisions.forEach((col) => {
            const collidedTile = level1.entries.find((tile) => tile.id === col.tile.id);
            level1.context.fillStyle = 'red';
            level1.context.fillRect(collidedTile.bounding.leftX, collidedTile.bounding.topY, collidedTile.dimensions.height, collidedTile.dimensions.width);
        });
        this.rightCollisions.forEach((col) => {
            const collidedTile = level1.entries.find((tile) => tile.id === col.tile.id);
            level1.context.fillStyle = 'blue';
            level1.context.fillRect(collidedTile.bounding.leftX, collidedTile.bounding.topY, collidedTile.dimensions.height, collidedTile.dimensions.width);
        });
        this.topCollisions.forEach((col) => {
            const collidedTile = level1.entries.find((tile) => tile.id === col.tile.id);
            level1.context.fillStyle = 'green';
            level1.context.fillRect(collidedTile.bounding.leftX, collidedTile.bounding.topY, collidedTile.dimensions.height, collidedTile.dimensions.width);
        });
        this.bottomCollisions.forEach((col) => {
            const collidedTile = level1.entries.find((tile) => tile.id === col.tile.id);
            level1.context.fillStyle = 'yellow';
            level1.context.fillRect(collidedTile.bounding.leftX, collidedTile.bounding.topY, collidedTile.dimensions.height, collidedTile.dimensions.width);
        });
    }
}
