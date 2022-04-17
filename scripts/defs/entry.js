class Entry {
    #position = {
        topY: 0,
        leftX: 0,
    }
    constructor({ height = 1, width = 1, setPosition: { x = 0, y = 0, useGrid = false }, background }) {
        this.id = uuid.v4();
        this.background = background;
        this.dimensions = {
            height: height * level1.config.gridSize,
            width: width * level1.config.gridSize
        }
        this.setPosition({ x, y, useGrid });
        this.render();
    }
    get bounding() {
        return {
            topY: this.#position.topY,
            bottomY: this.#position.topY + this.dimensions.height,
            leftX: this.#position.leftX,
            rightX: this.#position.leftX + this.dimensions.width,
        }
    }
    get centerPosition() {
        return {
            x: this.bounding.leftX + (this.dimensions.width / 2),
            y: this.bounding.topY + (this.dimensions.height / 2) }
    }
    render() {
        document.addEventListener('render', (e) => this.draw(e), false);
    }
    draw() {
        if (this.background) {
            this.background();
        } else {
            level1.context.fillStyle = 'teal';
            level1.context.fillRect(this.bounding.leftX, this.bounding.topY, this.dimensions.height, this.dimensions.width);
        }
    }
    setPosition({ x = this.bounding.leftX, y = this.bounding.topY, useGrid = false }) {
        this.#position.leftX = useGrid ? x * level1.config.gridSize : x;
        this.#position.topY = useGrid ? y * level1.config.gridSize : y;
    }
    move({ x = 0, y = 0, useGrid = false }) {
        const xToMove = useGrid ? x * level1.config.gridSize : x;
        const yToMove = useGrid ? y * level1.config.gridSize : y;
        const newXPosition = this.bounding.leftX + xToMove;
        const newYPosition = this.bounding.topY + yToMove;
        this.setPosition({ x: newXPosition, y: newYPosition, useGrid: false });
    }
}
