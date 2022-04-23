class Level extends Index {
    constructor({ name = 'level', gridDisplay = false, highlightCollisions = false, startingPosition = { x: 0, y: 0 } }) {
        super();
        this.canvas = document.createElement('canvas');
        this.canvas.id = name;
        this.context = this.canvas.getContext("2d");
        this.running = true;
        this.entries = [];
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
        this.alignCanvas();
        this.clearCanvas();

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
