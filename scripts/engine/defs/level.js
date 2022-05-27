// classes
import Index from './index.js';
import Tile from './tile.js';
import Character from './character.js';
import Entity from './entity.js';
import Player from './player.js';
import Layer from './layer.js';
// utils
import { clamp, isBetween } from '../utils/helpers.js';

export default class Level extends Index {
    constructor({ name = 'level', gridDisplay = false, highlightCollisions = false, startingPosition = { x: 0, y: 0 } }) {
        super();
        this.name = name;
        this.layers = {
            tiles: new Layer({ alpha: true, tag: 'tiles' }, this),
            characters: new Layer({ alpha: true, tag: 'characters' }, this)
        }
        this.container = document.createElement('div');
        this.container.id = this.id;
        this.container.classList.add('level');
        this.container.tabIndex = -1;
        // if the player clicks out of the game, and clicks back the controls should still work
        this.container.addEventListener('click', () => {
            this.container.focus();
        });
        this.zoomOptions = {
            small: 48,
            medium: 32,
            large: 24
        }
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
            leftX: this.camera.entity.centerPosition.x - this.layers.characters.canvas.width / 2,
            rightX: this.camera.entity.centerPosition.x + this.layers.characters.canvas.width / 2,
            topY: this.camera.entity.centerPosition.y - this.layers.characters.canvas.height / 2,
            bottomY: this.camera.entity.centerPosition.y + this.layers.characters.canvas.height / 2
        }
    }
    get tilesOnScreen() {
        // required to clean up empty items in tiles after removing blocks with right click
        this.tiles = this.tiles.filter((tile) => tile);
        return this.tiles.filter((tile) => {
            return isBetween((this.cameraBounding.leftX / this.config.gridSize) - ((this.layers.characters.canvas.width / this.config.gridSize) / 2),
                (this.cameraBounding.rightX / this.config.gridSize) + ((this.layers.characters.canvas.width / this.config.gridSize) / 2), tile.x) &&
                isBetween((this.cameraBounding.topY / this.config.gridSize) - ((this.layers.characters.canvas.height / this.config.gridSize) / 2),
                    (this.cameraBounding.bottomY / this.config.gridSize) + ((this.layers.characters.canvas.height / this.config.gridSize) / 2), tile.y);
        })
    }
    toggle() {
        this.running ? this.pause() : this.play();
    }
    init() {
        document.body.appendChild(this.container);
        this.layers.characters.place();
        this.play();
    };
    play() {
        this.container.focus();
        this.running = true;
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    pause() {
        this.running = false;
        window.cancelAnimationFrame(this.currentFrame);
    }
    addCharacter(character) {
        if (character instanceof Character) {
            this.characters.push(character);
            console.log(`Added new character: ${character.id}`);
        } else {
            throw new Error('cannot add non-character object as character');
        }
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
        this.layers.characters.context.drawImage(this.layers.tiles.canvas, 0, 0, this.layers.characters.canvas.width, this.layers.characters.canvas.width, 0, 0, this.layers.characters.canvas.width, this.layers.characters.canvas.width);
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
        this.tilesOnScreen.forEach((tile) => {
            const entryMatchingTile = this.entries.findIndex((entry) => entry.gridBounding.leftX === tile.x && entry.gridBounding.topY === tile.y);
            if (entryMatchingTile < 0) {
                const newTiles = new Tile({ setPosition: { x: tile.x, y: tile.y, useGrid: true }, texture: tile.texture }, this);
                this.entries.push(newTiles);
                newTiles.draw();
            }
        });
    }
    cleanupEntries() {
        this.entries.forEach((entry, index) => {
            const tileOnSCreenMatchingEntry = this.tilesOnScreen.findIndex((tile) => tile.x === entry.gridBounding.leftX && tile.y === entry.gridBounding.topY);
            if (tileOnSCreenMatchingEntry < 0) {
                this.entries[index].clear();
                this.entries.splice(index);
            }
        });
    }
    render(timestamp) {
        if (timestamp > this.then + this.fpsInterval) {
            this.then = timestamp;

            this.setupCanvases();
            this.setupGrid();
            this.clearCanvases();
            this.handleCamera();
            this.createEntries();
            this.cleanupEntries();
            this.renderTiles();
            this.animatePlayer();
            this.renderCharacters();
        }
        // request next animation frame
        this.currentFrame = window.requestAnimationFrame((e) => this.render(e));
    }
    setupCanvases() {
        this.layers.tiles.setup({ width: this.config.gridWidth * this.config.gridSize, height: this.config.gridHeight * this.config.gridSize });
        this.layers.characters.setup();
    }
    setupGrid() {
        // Set the grid size
        this.config.gridSize = Math.floor(screen.width / this.zoomOptions['small']);
    }
    handleCamera() {
        if (this.camera.follow === true) {
            if (this.camera.entity) {
                this.cameraX = clamp(this.cameraBounding.leftX, this.bounding.leftX, this.bounding.rightX - this.layers.characters.canvas.width);
                this.cameraY = clamp(this.cameraBounding.topY, this.bounding.topY, this.bounding.bottomY - this.layers.characters.canvas.height);
                this.layers.characters.context.translate(-this.cameraX, -this.cameraY);
            } else {
                console.error('nothing to follow');
            }
        }
    }
    clearCanvases() {
        this.layers.characters.reset();
        this.layers.characters.clear();
    };
}
