const Entity = require('./entity');
const Worldview = require('./worldview');
const service = require('../singletons/service');
const world = require('../singletons/world');

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
        this.worldview = new Worldview(); // median worldview
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

    getPopulation () {
        return this.population;
    }

    getPayload () {
        return {
            id: this.getId(),
            name: this.name,
            country: this.getCountry().getId(),
            population: this.getPopulation()
        }
    }
}

service.registerHandler('regions', (params, player) => {
    if (player)
    {
        return world.entities.Region.map(region => region.getPayload());
    }
    return [];
});

Entity.registerClass(Region);
module.exports = Region;
