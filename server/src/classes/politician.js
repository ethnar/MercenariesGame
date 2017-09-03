const Entity = require('./entity');
const Human = require('./human');
const misc = require('../singletons/misc');
const world = require('../singletons/world');
const Fact = require('./fact');

class Politician extends Human {
    constructor (args) {
        super(args);

        args = args || {};

        this.country = args.country;
    }

    cycle (cycles) {
    }

    getPayload(player) {
        const data = super.getPayload(player);
        return data;
    }
}

Entity.registerClass(Politician);
module.exports = Politician;
