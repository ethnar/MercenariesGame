const Entity = require('./entity');
const Worldview = require('./worldview');

class Organisation extends Entity {
    constructor (args) {
        super(args);

        args = args || {};

        this.name = args.name;
        this.worldview = new Worldview(args.worldview);
    }

    cycle (cycles) {
    }
}

Entity.registerClass(Organisation);
module.exports = Organisation;
