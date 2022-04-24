class Level extends Index {
    constructor({ name = 'level', gridDisplay = false, highlightCollisions = false, startingPosition = { x: 0, y: 0 } }) {
        super();
        this.canvas = document.createElement('canvas');
        this.canvas.id = name;
        this.canvas.style.left = '0px';
        this.canvas.style.top = '0px';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
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
        this.loadTiles();
    }
    get bounding() {
        return {
            topY: 0,
            leftX: 0,
            rightX: this.config.canvasWidth,
            bottomY: this.config.canvasHeight,
        }
    }
    get cameraBounding() {
        return {
            leftX: this.player.centerPosition.x - this.canvas.width / 2,
            rightX: this.player.centerPosition.x + this.canvas.width / 2,
            topY: this.player.centerPosition.y - this.canvas.height / 2,
            bottomY: this.player.centerPosition.y + this.canvas.height / 2
        }
    }
    get tilesOnScreen() {
        return this.tiles.filter((tile) => {
            return isBetween(this.cameraBounding.leftX / this.config.gridSize, this.cameraBounding.rightX / this.config.gridSize, tile.x) &&
            isBetween(this.cameraBounding.topY / this.config.gridSize, this.cameraBounding.bottomY / this.config.gridSize, tile.y);
        })
    }
    async loadTiles() {
        const response = await fetch('/scripts/tiles.json').catch((error) => {
            console.error(error);
        });
        const data = await response.json();
        data.forEach((tile) => {
            this.tiles.push(tile);
        });
        this.renderTiles();
    }
    renderTiles() {
        this.tilesOnScreen.forEach((tile) => {
            const entriesMatchingTile = this.entries.filter((entry) => entry.gridBounding.leftX === tile.x && entry.gridBounding.topY === tile.y);
            if (entriesMatchingTile.length < 1) {
                level1.entries.push(new Tile({ setPosition: { x: tile.x, y: tile.y, useGrid: true }, texture: tile.texture }));
            }
        });
    }
    cleanupEntries() {
        this.entries = this.entries.filter((entry) => entry);
        this.entries.forEach((entry, index) => {
            const tilesOnSCreenMatchingEntry = this.tilesOnScreen.filter((tile) => tile.x === entry.gridBounding.leftX && tile.y === entry.gridBounding.topY);
            if (tilesOnSCreenMatchingEntry.length < 1) {
                this.entries[index].kill();
                delete this.entries[index];
            }
        });
    }
    toggle() {
        this.running ? this.pause() : this.play();
    }
    init() {
        document.body.appendChild(this.canvas);
        this.play();
    };
    play() {
        this.running = true;
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    pause() {
        this.running = false;
        window.cancelAnimationFrame(this.currentFrame);
    }
    render(timestamp) {
        this.clearCanvas();
        this.handleCamera();
        this.renderTiles();
        this.cleanupEntries();

        // dispatch re-render event
        let renderEvent = new CustomEvent('render', { detail: { timestamp } });
        document.dispatchEvent(renderEvent);

        // request next animation frame
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    handleCamera() {
        const cameraX = clamp(this.cameraBounding.leftX, this.bounding.leftX, this.bounding.rightX - this.canvas.width);
        const cameraY = clamp(this.cameraBounding.topY, this.bounding.topY, this.bounding.bottomY - this.canvas.height);
        this.context.translate(-cameraX, -cameraY);
    }
    clearCanvas() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}
