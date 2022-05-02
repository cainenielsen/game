import Index from './index.js';

class Layer extends Index {
    constructor({ alpha = false }, level) {
        super();
        this.level = level;
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.id;
        this.canvas.classList.add("layer");
        this.canvas.tabIndex = -1;
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0px';
        this.canvas.style.top = '0px';
        this.canvas.addEventListener("contextmenu", e => e.preventDefault(), false);
        this.context = this.canvas.getContext("2d", { alpha });
    }
    place() {
        this.level.container.appendChild(this.canvas);
    }
    focus() {
        this.canvas.focus();
    }
    setup() {
        // See https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        // for more details

        // Get the DPR and size of the canvas
        const dpr = window.devicePixelRatio;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight

        // Set the "actual" size of the canvas
        this.canvas.width = windowWidth * dpr;
        this.canvas.height = windowHeight * dpr;

        // Scale the context to ensure correct drawing operations
        this.context.scale(dpr, dpr);

        // Set the "drawn" size of the canvas
        this.canvas.style.width = windowWidth + 'px';
        this.canvas.style.height = windowHeight + 'px';
    }
    clear() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Layer;
