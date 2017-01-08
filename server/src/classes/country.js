const Worldview = require('./worldview');
const Entity = require('./entity');

class Country extends Entity {
    constructor (name) {
        super();
        this.name = name;
        this.worldview = new Worldview();
        this.ruler = null;
        this.armyLeader = null;
        this.missions = [];
    }

    cycle () {
    }
}

Entity.registerClass(Country);
module.exports = Country;
