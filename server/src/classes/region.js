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
        this.missions = [];
        this.population = 10000;
        this.worldviews = {
            lowest: new Worldview(),
            median: new Worldview(),
            highest: new Worldview()
        };
    }

    addSite (site) {
        this.sites.push(site);
    }

    addMission (mission) {
        this.missions.push(mission);
    }

    getSites () {
        return this.sites;
    }

    getCountry () {
        return this.country;
    }

    getMissions(){
        return this.missions;
    }
}

Entity.registerClass(Region);
module.exports = Region;
