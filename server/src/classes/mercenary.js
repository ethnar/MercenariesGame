const Entity = require('./entity');
const Worldview = require('./worldview');

class Mercenary extends Entity {
    constructor () {
        super();
        this.worldview = new Worldview();
    }
}

Entity.registerClass(Mercenary);
module.exports = Mercenary;
