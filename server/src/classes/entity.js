let ids = {};

class Entity {
    constructor (className) {
        if (!className) {
            throw new Error('Unmapped entity ' + this.constructor.name);
        }
        this.className = className;
        if (!world[className]) {
            world[className] = [];
        }
        ids[className] = (ids[className] || 0) + 1;
        this.id = ids[className];

        world[className].push(this);
    }

    destroy () {
        let idx = world[this.className].indexOf(this);
        world[this.className].splice(idx, 1);
    }
}

module.exports = Entity;
