const Entity = require('./entity');
const Worldview = require('./worldview');

class Human extends Entity {
    constructor () {
        super();
        this.worldview = new Worldview();
    }
}

Entity.registerClass(Human);
module.exports = Human;
