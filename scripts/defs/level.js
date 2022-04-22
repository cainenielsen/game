class Level extends Index {
    constructor({ name = 'level', gridDisplay = false, highlightCollisions = false, startingPosition = { x: 0, y: 0 } }) {
        super();
        this.canvas = document.createElement('canvas');
        this.canvas.id = name;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.running = true;
        this.entries = [];
        this.tiles = [];
        this.config = {
            gridSize: Math.floor(window.innerHeight / 32),
            gridDisplay: gridDisplay,
            highlightCollisions: highlightCollisions
        }
        this.config.gridWidth = 128;
        this.config.gridHeight = 128;
        this.config.canvasWidth = this.config.gridWidth * this.config.gridSize;
        this.config.canvasHeight = this.config.gridHeight * this.config.gridSize,
        this.config.startingPosition = { x: startingPosition.x * this.config.gridSize, y: startingPosition.y * this.config.gridSize };
        this.renderEvent = new Event('render');
        this.init();
    }
    get halfScreenWidth() {
        return window.innerWidth / 2;
    }
    get halfScreenHeight() {
        return window.innerHeight / 2;
    }
    get bounding() {
        return {
            topY: 0,
            leftX: 0,
            rightX: this.config.canvasWidth,
            bottomY: this.config.canvasHeight,
        }
    }
    get cameraFrame() {
        return {
            topY: this.player.clampedDistanceFromTop,
            leftX: this.player.clampedDistanceFromLeft,
            bottomY: this.player.clampedDistanceFromTop + window.innerHeight,
            rightX: this.player.clampedDistanceFromLeft + window.innerWidth
        }
    }
    get tilesInFrame() {
        const renderBox = this.player.renderBox;
        return this.tiles.filter((tile) => isBetween(renderBox.leftX, renderBox.rightX, tile.position.x) && isBetween(renderBox.topY, renderBox.bottomY, tile.position.y))
    }
    addTiles(tilesArray) {
        this.tiles = tilesArray;
        // console.log(`${this.tiles.length} tiles added`);
    }
    renderTiles() {
        // console.log(`${this.tilesInFrame.length} tiles to render`);
        this.tilesInFrame.forEach((tile) => {
            const entriesMatchingTile = this.entries.filter((entry) => entry.gridBounding.leftX === tile.position.x && entry.gridBounding.topY === tile.position.y);
            if (entriesMatchingTile.length < 1) {
                this.entries.push(new Tile({ setPosition: { x: tile.position.x, y: tile.position.y, useGrid: true }, texture: tile.texture }));
            }
        });
    }
    cleanUpEntries() {
        // console.log(`${this.entries.length} entries to audit`);
        this.entries.forEach((entry, index) => {
            const tilesMatchingEntry = this.tilesInFrame.filter((tile) => tile.position.x === entry.gridBounding.leftX && tile.position.y === entry.gridBounding.topY);
            if (tilesMatchingEntry.length < 1) {
                this.entries.splice(index);
            }
        });
    }
    toggle() {
        this.running ? this.destroy() : this.init();
    }
    init() {
        this.running = true;
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    };
    destroy() {
        this.running = false;
        window.cancelAnimationFrame(this.currentFrame);
    }
    render(timestamp) {
        this.alignCanvas();
        this.clearCanvas();
        this.cleanUpEntries();
        this.renderTiles();

        // dispatch re-render event
        document.dispatchEvent(this.renderEvent, { detail: { timestamp } });

        // request next animation frame
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    alignCanvas() {
        this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;
    };
    clearCanvas() {
        this.context.fillStyle = clearBrush;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
}
