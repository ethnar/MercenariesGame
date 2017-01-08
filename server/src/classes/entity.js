let world = require('../singletons/world');

let ids = {};

class Entity {
    constructor () {
        const className = this.constructor.name;
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

let classRegistry = {};
Entity.registerClass = classConstructor => {
    classRegistry[classConstructor.name] = classConstructor;
};

Entity.loadFromJson = data => {
    let entity = new classRegistry[data.className]();
    Object.keys(data).forEach(key => {
        entity[key] = data[key];
    });
    return entity;
};

Entity.updateReferences = param => {
    if (typeof param === 'object') {
        Object.keys(param).forEach(key => {
            if (param[key].className && !param instanceof Entity) {
                param[key] = world.entities[param[key].className].find(item => item.id === param[key].id);
            } else {
                Entity.updateReferences(param[key]);
            }
        });
    }
};

module.exports = Entity;
