const Entity = require('./entity');

class Site extends Entity {
    constructor (name, region) {
        super();
        this.name = name;
        this.region = region;
        if (region) {
            this.region.addSite(this);
        }
        this.owner = null;
        this.countryProperty = null;
        this.standard = 50;
        this.size = 1;
        this.destroyed = false;
    }

    setStandard (value) {
        this.standard = value;
    }

    setSize (value) {
        this.size = value;
    }

    setOwner (owner) {
        this.owner = owner;
        owner.addSite(this);
        this.countryProperty = null;
    }

    getRegion () {
        return this.region;
    }

    isDestroyed () {
        return this.destroyed;
    }
}

Entity.registerClass(Site);
module.exports = Site;
