const Entity = require('./entity');

class Mercenary extends Entity {
    constructor () {
        super();
    }
}

Entity.registerClass(Mercenary);
module.exports = Mercenary;
