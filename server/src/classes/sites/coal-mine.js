const Site = require('../site');
const Fact = require('../fact');
const Entity = require('../entity');
const misc = require('../../singletons/misc');

class CoalMine extends Site {
    constructor (args) {
        args = Object.assign({}, args);
        args.className = 'Site';
        super(args);

        this.name = 'Mine';

        this.striking = false;
        this.slavery = this.region.getWorldview().chances('slavery', 2);
    }

    getLabelPayload () {
        return '{Site:' + this.id + ':' + this.getLabel() + '}';
    }

    getRegion () {
        return this.region;
    }

    cycle (cycles) {
        if (cycles.rare)
        {
        }
    }
}

Entity.registerClass(CoalMine);
module.exports = CoalMine;