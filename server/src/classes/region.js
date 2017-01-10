const Entity = require('./entity');
const Worldview = require('./worldview');

class Region extends Entity {
    constructor (name, country) {
        super();
        this.name = name;
        this.country = country;
        if (country) {
            this.country.addRegion(this);
        }
        this.sites = [];
        this.worldviews = {
            lowest: new Worldview(),
            median: new Worldview(),
            highest: new Worldview()
        };
    }

    addSite (site) {
        this.sites.push(site);
    }

    getSites () {
        return this.sites;
    }

    getCountry () {
        return this.country;
    }
}

Entity.registerClass(Region);
module.exports = Region;
