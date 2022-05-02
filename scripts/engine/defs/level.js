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
            characters: new Layer({ alpha: true }, this),
            tiles: new Layer({ alpha: true }, this)
        }
        this.container = document.createElement('div');
        this.container.id = this.id;
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
            leftX: this.camera.entity.centerPosition.x - window.innerWidth / 2,
            rightX: this.camera.entity.centerPosition.x + window.innerWidth / 2,
            topY: this.camera.entity.centerPosition.y - window.innerHeight / 2,
            bottomY: this.camera.entity.centerPosition.y + window.innerHeight / 2
        }
    }
    get tilesOnScreen() {
        // required to clean up empty items in tiles after removing blocks with right click
        this.tiles = this.tiles.filter((tile) => tile);
        return this.tiles.filter((tile) => {
            return isBetween((this.cameraBounding.leftX / this.config.gridSize) - ((window.innerWidth / this.config.gridSize) / 2),
            (this.cameraBounding.rightX / this.config.gridSize) + ((window.innerWidth / this.config.gridSize) / 2), tile.x) &&
                isBetween((this.cameraBounding.topY / this.config.gridSize) - ((window.innerHeight / this.config.gridSize) / 2),
                (this.cameraBounding.bottomY / this.config.gridSize) + ((window.innerHeight / this.config.gridSize) / 2), tile.y);
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

            this.setupCanvases();
            this.setupGrid();
            this.clearCanvases();
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
    setupCanvases() {
        this.layers.characters.setup();
    }
    setupGrid() {
        // Set the grid size
        this.config.gridSize = Math.floor(screen.width / this.zoomOptions['small']);
    }
    handleCamera() {
        if (this.camera.follow === true) {
            if (this.camera.entity) {
                const cameraX = clamp(this.cameraBounding.leftX, this.bounding.leftX, this.bounding.rightX - window.innerWidth);
                const cameraY = clamp(this.cameraBounding.topY, this.bounding.topY, this.bounding.bottomY - window.innerHeight);
                this.layers.characters.context.translate(-cameraX, -cameraY);
            } else {
                console.error('nothing to follow');
            }
        }
    }
    clearCanvases() {
        this.layers.characters.clear();
    };
}
