import Index from './index.js';

export default class Entity extends Index {
    #position = {
        topY: 0,
        leftX: 0,
    }
    constructor({ height = 1, width = 1, setPosition: { x = 0, y = 0, useGrid = false } }, level) {
        super();
        this.level = level;
        this.dimensions = {
            height: height * this.level.config.gridSize,
            width: width * this.level.config.gridSize
        }
        this.setPosition({ x, y, useGrid });
    }
    get halfWidth() {
        return this.dimensions.height / 2;
    }
    get halfHeight() {
        return this.dimensions.width / 2;
    }
    get bounding() {
        return {
            topY: this.#position.topY,
            bottomY: this.#position.topY + this.dimensions.height,
            leftX: this.#position.leftX,
            rightX: this.#position.leftX + this.dimensions.width,
        }
    }
    get gridBounding() {
        return {
            topY: this.bounding.topY / this.level.config.gridSize,
            bottomY: this.bounding.bottomY / this.level.config.gridSize,
            leftX: this.bounding.leftX / this.level.config.gridSize,
            rightX: this.bounding.rightX / this.level.config.gridSize,
        }
    }
    get centerPosition() {
        return {
            x: this.bounding.leftX + this.halfWidth,
            y: this.bounding.topY + this.halfHeight
        }
    }
    setPosition({ x = this.bounding.leftX, y = this.bounding.topY, useGrid = false }) {
        this.#position.leftX = useGrid ? x * this.level.config.gridSize : x;
        this.#position.topY = useGrid ? y * this.level.config.gridSize : y;
    }
    move({ x = 0, y = 0, useGrid = false }) {
        const xToMove = useGrid ? x * this.level.config.gridSize : x;
        const yToMove = useGrid ? y * this.level.config.gridSize : y;
        const newXPosition = this.bounding.leftX + xToMove;
        const newYPosition = this.bounding.topY + yToMove;
        this.setPosition({ x: newXPosition, y: newYPosition, useGrid: false });
    }
}
