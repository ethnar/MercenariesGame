const Entity = require('./entity');
const service = require('../singletons/service');
const misc = require('../misc');

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

    gatherIntelligence () {
        if (this.isDestroyed() || this.countryProperty) {
            return;
        }
        let region = this.getRegion();
        let country = region.getCountry();
        let facts = country.getRelatedFacts();
        facts.forEach(fact => {
            if (!this.owner.getFacts()[fact.id] && misc.chances(fact.getDiscoverability())) {
                this.owner.getFacts()[fact.id] = fact;
                service.sendUpdate('news', this.owner, fact.getFormatted());
            }
        });
    }

    isDestroyed () {
        return this.destroyed;
    }
}

Entity.registerClass(Site);
module.exports = Site;
