import Index from './index.js';

class Layer extends Index {
    constructor({ alpha = false, tag = 'general' }, level) {
        super();
        this.level = level;
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.id;
        this.canvas.classList.add('layer');
        this.canvas.classList.add(`${tag}-layer`);
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
    setup({ width: fixedWidth, height: fixedHeight } = {}) {
        // See https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        // for more details

        // Get the DPR and size of the canvas
        const dpr = window.devicePixelRatio;

        const newCanvasWidth = fixedWidth || window.innerWidth;
        const newCanvasHeight = fixedHeight || window.innerHeight;

        // Set the "actual" size of the canvas
        if (this.canvas.width !== newCanvasWidth) this.canvas.width = newCanvasWidth * dpr;
        if (this.canvas.height !== newCanvasHeight) this.canvas.height = newCanvasHeight * dpr;

        // Scale the context to ensure correct drawing operations
        this.context.scale(dpr, dpr);

        // Set the "drawn" size of the canvas
        this.canvas.style.width = newCanvasWidth + 'px';
        this.canvas.style.height = newCanvasHeight + 'px';
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    reset() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

export default Layer;
