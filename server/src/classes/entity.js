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
        entity[key] = data[key];
    });
    return entity;
};

function recursiveUpdateReferences (param) {
}

Entity.updateReferences = function (param) {
    if (typeof param === 'object') {
        Object.keys(param).forEach(key => {
            if (param[key].className && !param instanceof Entity) {
                param[key] = world.entities[param[key].className].find(item => item.id === param[key].id);
            } else {
                recursiveUpdateReferences(param[key]);
            }
        });
    }
};

module.exports = Entity;
