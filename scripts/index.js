import { Game, Level, Player, keyboardModule, mouseModule } from './engine/index.js';
import { mouseHandler, keyDownHandler, keyUpHandler, keyPressHandler } from './controls.js';
import setupInterface from './interface.js';

const superGame = new Game();

const level1 = new Level({
    name: 'level_one',
    gridDisplay: false,
    startingPosition: { x: 2, y: 12 }
});

superGame.addLevel(level1);

const somePlayer = new Player({
    setPosition: { x: 2, y: 12, useGrid: true },
    height: 4,
    width: 2.
}, level1);

level1.addCharacter(somePlayer);
level1.setPlayer(somePlayer);
level1.follow(somePlayer);

mouseModule(level1, somePlayer, mouseHandler);

keyboardModule(level1, somePlayer, {
    keyDownHandler,
    keyUpHandler,
    keyPressHandler
});

setupInterface(superGame, level1, somePlayer);
