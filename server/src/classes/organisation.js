const Entity = require('./entity');
const Worldview = require('./worldview');
const world = require('../singletons/world');
const misc = require('../singletons/misc');

class Organisation extends Entity {
    constructor (args) {
        super(args);

        args = args || {};

        this.name = args.name;
        this.worldview = new Worldview(args.worldview);
    }

    getWorldview() {
        return this.worldview;
    }

    attemptToCaptureSite() {
        const availableSites = world.getEntitiesArray('Site')
            .filter(site => site.organisable && !site.isOccupied());

        if (availableSites.length) {
            const targetSite = misc.randomEntity(availableSites);

            // TODO: actually consider what is the worldview in region
            targetSite.setOrganisation(this);
        }
    }

    cycle (cycles) {
        if (cycles.rare) {
            this.attemptToCaptureSite();
        }
    }
}

Entity.registerClass(Organisation);
module.exports = Organisation;
