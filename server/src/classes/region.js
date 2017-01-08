const Entity = require('./entity');

class Region extends Entity {
    constructor () {
        super();
    }
}

Entity.registerClass(Region);
module.exports = Region;
