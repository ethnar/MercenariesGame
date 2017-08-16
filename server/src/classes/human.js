const Entity = require('./entity');
const Worldview = require('./worldview');

class Human extends Entity {
    constructor (args) {
        super(args);

        args = args || {};

        this.region = args.region;

        if (args.region) {
            this.name = args.region.getCountry().generateName();
            this.worldview = new Worldview(args.region.getWorldview());
        } else {
            throw new Error('Creating a new guy with no region of origin');
        }
    }

    getLabel () {
        return this.name;
    }

    getPayload (player) {
        return {
            id: this.getId(),
            name: this.name
        }
    }
}

Entity.registerClass(Human);
module.exports = Human;
