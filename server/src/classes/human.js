const Entity = require('./entity');
const Worldview = require('./worldview');

class Human extends Entity {
    constructor (args) {
        super(args);

        args = args || {};

        this.worldview = new Worldview();

        if (args.country) {
            this.name = args.country.generateName();
        } else {
            this.name = Math.random();
        }
    }

    getLabel () {
        return this.name;
    }

    getPayload () {
        return {
            id: this.getId(),
            name: this.name
        }
    }
}

Entity.registerClass(Human);
module.exports = Human;
