const Entity = require('./entity');
const Worldview = require('./worldview');
const Staff = require('./staff');
const Fact = require('./fact');
const service = require('../singletons/service');
const world = require('../singletons/world');
const misc = require('../singletons/misc');

const npcSites = {
    coalMine: require('./sites/coal-mine')
};

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
        this.recruits = [];
    }

    getLabel () {
        return this.name;
    }

    getWorldview (section) {
        if (section) {
            return this.worldview.get(section);
        }
        return this.worldview;
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

    getRecruits () {
        return this.recruits;
    }

    getPopulation () {
        return this.population;
    }

    getCoveringPlayers () { // TODO: does virtually the same what getCoveredRegions does. There's a high risk of discrepancy
        const players = {};
        this.getSites().forEach(site => {
            const player = site.getOwner();
            if (player) {
                players[player.getId()] = player;
            }
        });
        return Object.keys(players).map(id => players[id]);
    }

    getPayload () {
        return {
            id: this.getId(),
            name: this.name,
            country: this.getCountry().getId(),
            population: this.getPopulation()
        }
    }

    newRecruit () {
        const newGuy = new Staff({
            country: this.getCountry()
        });
        this.recruits.push(newGuy);
        const players = this.getCoveringPlayers();
        service.sendUpdate('recruits', players, newGuy.getPayload());
    }

    withdrawRecruit (recruit) {
        const index = this.recruits.indexOf(recruit);
        this.recruits.splice(index, 1);
        const players = this.getCoveringPlayers();
        service.sendUpdate('recruits', players, { delete: true, id: recruit.getId() });
    }

    cycle (cycles) {
        if (cycles.regular) {
            this.cycleRecruits();
            this.cycleSites();
        }
    }

    cycleRecruits () {
        const recruitsAvailable = this.getRecruits().length;
        switch (true) {
            case misc.chances(100 - recruitsAvailable * 5):
                this.newRecruit();
                break;
            case misc.chances(recruitsAvailable * 0.1):
                const recruit = misc.randomEntity(this.getRecruits());
                this.withdrawRecruit(recruit);
                break;
        }
    }

    cycleSites () {
        // at least 20 sites without an owner
        // at least 50 sites owned by npcs
        const emptySites = this.getSites().filter(site => !site.getOwner() && !site.npcOwned);
        const npcSites = this.getSites().filter(site => site.npcOwned);
        switch (true) {
            case misc.chances(20 - emptySites.length):
                this.newEmptySite();
                break;
            case misc.chances(200 - npcSites * 4):
                this.newNpcSite();
                break;
        }
    }

    newEmptySite () {
        const site = new npcSites.coalMine({region: this});
        this.addSite(site);
        new Fact(25, 'A new %s was opened in %s', site, this);
    }

    newNpcSite () {

    }
}

service.registerHandler('regions', (params, player) => {
    if (player)
    {
        return world.entities.Region.map(region => region.getPayload());
    }
    return [];
});

service.registerHandler('recruits', (params, player) => {
    if (player)
    {
        let regions = player.getCoveredRegions();
        let recruits = [];
        regions.forEach(region => {
            recruits = recruits.concat(region.getRecruits());
        });
        return recruits.map(personnel => personnel.getPayload());
    }
    return [];
});

Entity.registerClass(Region);
module.exports = Region;
