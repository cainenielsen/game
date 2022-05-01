import Index from './index.js';
import Level from './level.js';

export default class Game extends Index {
    constructor() {
        super();
        this.levels = [];
        this.selectedLevel;
    }
    start() {
        this.selectLevel(0);
    }
    addLevel(level) {
        if (level instanceof Level ) {
            this.levels.push(level);
        } else {
            throw new Error('cannot add non-level object as level');
        }
    }
    selectLevel(selection) {
        const selectedId = this.selectedLevel?.id;
        if (selectedId != this.levels[selection].id ) {
            if (this.levels.length > 0) {
                if (this.levels[selection].init) {
                    this.selectedLevel = this.levels[selection];
                    this.selectedLevel.init();
                } else {
                    alert('level cannot be initialized');
                }
            } else {
                alert('no levels to select');
            }
        } else {
            alert('this level already selected');
        }
    }
}
