class Character extends Entity {
    constructor({ height, width, setPosition, maxSpeed = 7.5 }) {
        super({ height, width, setPosition });
        this.maxSpeed = maxSpeed;
        this.jumping = false;
        this.collisions = [];
        this.velocity = {
            vertical: 0,
            horizontal: 0
        };
        this.init();
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
    get isOnTile() {
        return this.bottomCollisions.length > 0;
    }
    get isUnderTile() {
        return this.topCollisions.length > 0;
    }
    get isInCanvas() {
        return this.bounding.bottomY < level1.canvas.height;
    }
    get isLeftCollided() {
        return this.leftCollisions.length > 0;
    }
    get isRightCollided() {
        return this.rightCollisions.length > 0;
    }
    init() {
        // we should move this stuff to a callable function that is run by the level
        // get rid of the event listener
        document.addEventListener('render', (e) => {
            this.handleMomentum(e);
            this.handleGravity(e);
            this.handleVelocityEntropy(e);
            this.highlightCollisions(e);
        }, false);
        document.addEventListener('animate', (e) => {
            // might be able to move these to render soon
            this.handleStageLimits(e);
            this.gatherCollisions(e);
            this.enforceCollisions(e);
        }, false);
    }
    handleGravity() {
        if (!this.isOnTile) {
            this.velocity.vertical = this.velocity.vertical + 0.75;
        }
        this.move({ y: this.velocity.vertical });
    }
    handleMomentum() {
        this.move({ x: this.velocity.horizontal });
    }
    enforceCollisions() {
        if (this.isOnTile) {
            if (this.velocity.vertical > 0) {
                this.velocity.vertical = 0;
                this.setPosition({ y: this.bottomCollisions[0].tile.bounding.topY - this.dimensions.height });
                this.jumping = false;
            }
        }

        if (this.isUnderTile) {
            this.velocity.vertical = 0;
            this.setPosition({ y: this.topCollisions[0].tile.bounding.bottomY });
        }

        if (this.isLeftCollided) {
            this.velocity.horizontal = 0;
            this.setPosition({ x: this.leftCollisions[0].tile.bounding.rightX });
        }

        if (this.isRightCollided) {
            this.velocity.horizontal = 0;
            this.setPosition({ x: this.rightCollisions[0].tile.bounding.leftX - this.dimensions.width });
        }
    }
    gatherCollisions() {
        level1.entries.forEach((tile) => {
            const collide = detectCollision2(tile.bounding, tile.dimensions, this.bounding, this.dimensions)
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
        if (!detectContaining(this, level1)) {
            if (this.bounding.leftX < level1.bounding.leftX) {
                this.velocity.horizontal = 0;
                this.setPosition({ x: level1.bounding.leftX });
            }
            if (this.bounding.rightX > level1.bounding.rightX) {
                this.velocity.horizontal = 0;
                this.setPosition({ x: level1.bounding.rightX - this.dimensions.width });
            }
            if (this.bounding.topY < level1.bounding.topY) {
                this.velocity.vertical = 0;
                this.setPosition({ y: level1.bounding.topY });
            }
            if (this.bounding.bottomY > level1.bounding.bottomY) {
                this.velocity.vertical = 0;
                this.velocity.horizontal = 0;
                this.setPosition({ x: level1.config.startingPosition.x, y: level1.config.startingPosition.y });
            }
        }
    };
    handleVelocityEntropy() {
        if (Math.abs(this.velocity.horizontal) >= 0.5) {
            this.velocity.horizontal = this.velocity.horizontal * 0.95;
        } else {
            this.velocity.horizontal = 0;
        }
    };
    highlightCollisions() {
        if (level1.config.highlightCollisions === true) {
            this.collisions.forEach((col) => {
                const collidedTile = level1.entries.find((tile) => tile.id === col.tile.id);
                level1.context.fillStyle = 'pink';
                level1.context.fillRect(collidedTile.bounding.leftX, collidedTile.bounding.topY, collidedTile.dimensions.height, collidedTile.dimensions.width);
            });
        }
    }
}
