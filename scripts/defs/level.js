class Level extends Index {
    constructor(name = 'level') {
        super();
        this.canvas = document.createElement('canvas');
        this.canvas.id = name;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.running = true;
        this.entries = [];
        this.config = {
            gridSize: Math.floor(window.innerHeight / 16),
            gridDisplay: false
        }
        this.config.canvasWidth = 128 * this.config.gridSize;
        this.config.canvasHeight = 32 * this.config.gridSize,
        this.config.startingPosition = { x: 2 * this.config.gridSize, y: 17 * this.config.gridSize };
        this.renderEvent = new Event('render');
        this.init();
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
