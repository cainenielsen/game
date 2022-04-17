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
            canvasWidth: 128,
            canvasHeight: 32,
            gridDisplay: true
        }
        this.config.startingPosition = { x: 2 * this.config.gridSize, y: 17 * this.config.gridSize };
        this.renderEvent = new Event('render');
        this.init();
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
        this.canvas.width = this.config.gridSize * this.config.canvasWidth;
        this.canvas.height = this.config.gridSize * this.config.canvasHeight;
    };
    clearCanvas() {
        this.context.fillStyle = clearBrush;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
}
