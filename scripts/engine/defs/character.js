// classes
import Entity from './entity.js';
// utils
import detectContaining from '../utils/detectContaining.js';
import { detectCollision2 } from '../utils/detectCollision.js';

export default class Character extends Entity {
    constructor({ height, width, setPosition, maxSpeed = 7.5 }, level) {
        super({ height, width, setPosition }, level);
        this.maxSpeed = maxSpeed;
        this.jumping = false;
        this.collisions = [];
        this.velocity = {
            vertical: 0,
            horizontal: 0
        };
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
        return this.bounding.bottomY < this.level.canvas.height;
    }
    get isLeftCollided() {
        return this.leftCollisions.length > 0;
    }
    get isRightCollided() {
        return this.rightCollisions.length > 0;
    }
    render() {
        this.handleMomentum();
        this.handleGravity();
        this.handleVelocityEntropy();
        this.highlightCollisions();
        this.handleStageLimits();
        this.gatherCollisions();
        this.enforceCollisions();
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
        this.level.entries.forEach((tile) => {
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
        if (!detectContaining(this, this.level)) {
            if (this.bounding.leftX < this.level.bounding.leftX) {
                this.velocity.horizontal = 0;
                this.setPosition({ x: this.level.bounding.leftX });
            }
            if (this.bounding.rightX > this.level.bounding.rightX) {
                this.velocity.horizontal = 0;
                this.setPosition({ x: this.level.bounding.rightX - this.dimensions.width });
            }
            if (this.bounding.topY < this.level.bounding.topY) {
                this.velocity.vertical = 0;
                this.setPosition({ y: this.level.bounding.topY });
            }
            if (this.bounding.bottomY > this.level.bounding.bottomY) {
                this.velocity.vertical = 0;
                this.velocity.horizontal = 0;
                this.setPosition({ x: this.level.config.startingPosition.x, y: this.level.config.startingPosition.y });
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
        if (this.level.config.highlightCollisions === true) {
            this.collisions.forEach((col) => {
                const collidedTile = this.level.entries.find((tile) => tile.id === col.tile.id);
                this.level.context.fillStyle = 'pink';
                this.level.context.fillRect(collidedTile.bounding.leftX, collidedTile.bounding.topY, collidedTile.dimensions.height, collidedTile.dimensions.width);
            });
        }
    }
}
