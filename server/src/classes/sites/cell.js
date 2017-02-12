const Site = require('../site');
const Fact = require('../fact');
const Entity = require('../entity');
const misc = require('../../singletons/misc');

class Cell extends Site {
    constructor (args) {
        args = Object.assign({}, args);
        args.className = 'Site';
        super(args);
    }

    getLabelPayload () {
        return '{Site:' + this.id + ':' + this.getLabel() + '}';
    }

    getRegion () {
        return this.region;
    }

    cycle (cycles) {
        if (cycles.regular) {
            this.gatherIntelligence();
        }
    }
}

Entity.registerClass(Cell);
module.exports = Cell;