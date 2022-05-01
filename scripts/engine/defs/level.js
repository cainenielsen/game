// classes
import Index from './index.js';
import Tile from './tile.js';
import Character from './character.js';
import Entity from './entity.js';
import Player from './player.js';
// utils
import { clamp, isBetween } from '../utils/helpers.js';

export default class Level extends Index {
    constructor({ name = 'level', gridDisplay = false, highlightCollisions = false, startingPosition = { x: 0, y: 0 } }) {
        super();
        this.canvas = document.createElement('canvas');
        this.canvas.id = name;
        this.canvas.tabIndex = -1;
        // if the player clicks out of the game, and clicks back the controls should still work
        this.canvas.addEventListener('click', () => {
            this.canvas.focus();
        });
        this.canvas.style.left = '0px';
        this.canvas.style.top = '0px';
        this.zoomOptions = {
            small: 48,
            medium: 32,
            large: 24
        }
        this.context = this.canvas.getContext("2d", { alpha: true });
        this.running = true;
        this.characters = [];
        this.entries = [];
        this.tiles = [];
        this.camera = {
            follow: false
        }
        this.fps = 60;
        this.then = 0;
        this.zoomSelection = this.zoomOptions['small'];
        this.config = {
            gridSize: Math.floor(screen.width / this.zoomSelection),
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
    get fpsInterval() {
        return 1000 / this.fps;
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
            leftX: this.camera.entity.centerPosition.x - this.canvas.width / 2,
            rightX: this.camera.entity.centerPosition.x + this.canvas.width / 2,
            topY: this.camera.entity.centerPosition.y - this.canvas.height / 2,
            bottomY: this.camera.entity.centerPosition.y + this.canvas.height / 2
        }
    }
    get tilesOnScreen() {
        // required to clean up empty items in tiles after removing blocks with right click
        this.tiles = this.tiles.filter((tile) => tile);
        return this.tiles.filter((tile) => {
            return isBetween((this.cameraBounding.leftX / this.config.gridSize) - ((this.canvas.width / this.config.gridSize) / 2),
            (this.cameraBounding.rightX / this.config.gridSize) + ((this.canvas.width / this.config.gridSize) / 2), tile.x) &&
                isBetween((this.cameraBounding.topY / this.config.gridSize) - ((this.canvas.height / this.config.gridSize) / 2),
                (this.cameraBounding.bottomY / this.config.gridSize) + ((this.canvas.height / this.config.gridSize) / 2), tile.y);
        })
    }
    follow(entity) {
        if (entity instanceof Entity) {
            this.camera = {
                entity,
                follow: true
            };
            console.log(`Camera following entity: ${this.camera.entity.id}`);
        } else {
            console.error('cannot follow non-entity object');
        }
    }
    async loadTiles() {
        const response = await fetch('/scripts/tiles.json').catch((error) => {
            console.error(error);
        });
        const data = await response.json();
        data.forEach((tile) => {
            this.tiles.push(tile);
        });
        console.log(`Loaded ${this.tiles.length} tiles`);
    }
    renderTiles() {
        this.entries.forEach((entry) => entry.draw());
    }
    renderCharacters() {
        this.characters.forEach((character) => character.render());
    }
    setPlayer(player) {
        if (player instanceof Player) {
            this.player = player;
        }
    }
    animatePlayer() {
        if (this.player) {
            this.player.animate();
        }
    }
    createEntries() {
        // console.log(`${this.tilesOnScreen.length} tiles on screen`);
        this.tilesOnScreen.forEach((tile) => {
            const entriesMatchingTile = this.entries.filter((entry) => entry.gridBounding.leftX === tile.x && entry.gridBounding.topY === tile.y);
            if (entriesMatchingTile.length < 1) {
                this.entries.push(new Tile({ setPosition: { x: tile.x, y: tile.y, useGrid: true }, texture: tile.texture }, this));
            }
        });
    }
    cleanupEntries() {
        this.entries = this.entries.filter((entry) => entry);
        // console.log(`${this.entries.length} entries rendering`);
        this.entries.forEach((entry, index) => {
            const tilesOnSCreenMatchingEntry = this.tilesOnScreen.filter((tile) => tile.x === entry.gridBounding.leftX && tile.y === entry.gridBounding.topY);
            if (tilesOnSCreenMatchingEntry.length < 1) {
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
        this.canvas.focus();
        this.running = true;
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    pause() {
        this.running = false;
        window.cancelAnimationFrame(this.currentFrame);
    }
    addCharacter(character) {
        if (character instanceof Character ) {
            this.characters.push(character);
            console.log(`Added new character: ${character.id}`);
        } else {
            throw new Error('cannot add non-character object as character');
        }
    }
    render(timestamp) {
        if (timestamp > this.then + this.fpsInterval) {
            this.then = timestamp;

            this.setupCanvas();
            this.clearCanvas();
            this.handleCamera();
            this.createEntries();
            this.renderTiles();
            this.cleanupEntries();
            this.animatePlayer();
            this.renderCharacters();
        }
        // request next animation frame
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    setupCanvas() {
        // See https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        // for more details

        // Get the DPR and size of the canvas
        const dpr = window.devicePixelRatio;

        // Set the "actual" size of the canvas
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        // Scale the context to ensure correct drawing operations
        this.context.scale(dpr, dpr);

        // Set the "drawn" size of the canvas
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        // Set the grid size
        this.config.gridSize = Math.floor(screen.width / this.zoomOptions['small']);
    }
    handleCamera() {
        if (this.camera.follow === true) {
            if (this.camera.entity) {
                const cameraX = clamp(this.cameraBounding.leftX, this.bounding.leftX, this.bounding.rightX - this.canvas.width);
                const cameraY = clamp(this.cameraBounding.topY, this.bounding.topY, this.bounding.bottomY - this.canvas.height);
                this.context.translate(-cameraX, -cameraY);
            } else {
                console.error('nothing to follow');
            }
        }
    }
    clearCanvas() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}
