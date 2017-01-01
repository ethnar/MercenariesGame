let world = require('../singletons/world');

let ids = {};

class Entity {
    constructor (className) {
        if (!className) {
            throw new Error('Unmapped entity ' + this.constructor.name);
        }
        this.className = className;
        if (!world.entities[className]) {
            world.entities[className] = [];
        }
        ids[className] = (ids[className] || 0) + 1;
        this.id = ids[className];

        world.entities[className].push(this);
    }

    getSaveData () {
        let result = {};
        Object.keys(this).forEach(key => {
            if (this[key] instanceof Entity) {
                result[key] = {
                    className: this[key].className,
                    id: this[key].id
                }
            } else {
                result[key] = this[key];
            }
        });
        return result;
    }

    destroy () {
        let idx = world.entities[this.className].indexOf(this);
        world.entities[this.className].splice(idx, 1);
    }
}

Entity.loadFromJson = data => {
    let entity = new global[data.className]();
    Object.keys(data).forEach(key => {
        entity[key] = data[key]
        if (typeof data[key] === 'object' && data[key].className) {
            // TODO: tag as requiring update
        }
    });
    return entity;
};

module.exports = Entity;
