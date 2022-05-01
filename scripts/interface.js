import { elById, copyToClipBoard } from './utils.js';

const dirtButton = elById("dirt");
const spaceButton = elById("space");
const andesiteButton = elById("andesite");
const menu = elById("menu");
const menuClose = elById("menu-close");
const overlay = elById("overlay");
const buildMenu = elById("build-menu");
const dotButton = elById("dot-button");
const startButton = elById("start");
const copybutton = elById("copybutton");

dirtButton.style.transform = "scale(1.3)";
menu.style.display = "none";
overlay.style.display = "none";

const setupInterface = (game, level, player) => {
copybutton.addEventListener("click", () => {
    copyToClipBoard(level);
}, false);

dirtButton.addEventListener("click", () => {
    player.selectedTile = 'dirt';
    andesiteButton.style.transform = "scale(1)";
    dirtButton.style.transform = "scale(1.3)";
    spaceButton.style.transform = "scale(1)";
});

spaceButton.addEventListener("click", () => {
    player.selectedTile = 'space';
    andesiteButton.style.transform = "scale(1)";
    dirtButton.style.transform = "scale(1)";
    spaceButton.style.transform = "scale(1.3)";
});

andesiteButton.addEventListener("click", () => {
    player.selectedTile = 'andesite';
    andesiteButton.style.transform = "scale(1.3)";
    dirtButton.style.transform = "scale(1)";
    spaceButton.style.transform = "scale(1)";
});

dotButton.addEventListener("click", () => {
    menu.style.display = "grid";
    overlay.style.display = "block";
    level.toggle();
});

menuClose.addEventListener("click", () => {
    menu.style.display = "none";
    overlay.style.display = "none";
    level.toggle();
});

startButton.addEventListener("click", () => {
    dotButton.style.display = "grid";
    buildMenu.style.display = "inline-grid";
    game.start()
});
}

export default setupInterface;
