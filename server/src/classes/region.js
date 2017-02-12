const Entity = require('./entity');
const Worldview = require('./worldview');
const Staff = require('./staff');
const Fact = require('./fact');
const Site = require('./site');
const service = require('../singletons/service');
const world = require('../singletons/world');
const misc = require('../singletons/misc');

const Equipment = require('./equipment/equipment');

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
        this.equipment = [];
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

    getCoveringPlayers () {
        return world
            .getEntitiesArray('Player')
            .filter(player => player.isCoveringRegion(this));
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
            region: this
        });
        this.recruits.push(newGuy);
        const players = this.getCoveringPlayers();
        service.sendUpdate('recruits', players, newGuy.getPayload());
    }

    withdrawRecruit (recruit) {
        const index = this.recruits.indexOf(recruit);
        this.recruits.splice(index, 1);
        const players = this.getCoveringPlayers();
        service.sendDeletion('recruits', players, recruit.getId());
    }

    cycle (cycles) {
        if (cycles.regular) {
            this.cycleRecruits();
            this.cycleSites();
        }
        if (cycles.rare) {
            this.cycleStores();
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
        const emptySites = this.getSites().filter(site => !site.isOccupied());
        // at least 50 sites owned by npcs
        const npcSites = this.getSites().filter(site => site.npcOwned);
        switch (true) {
            case misc.chances(20 - emptySites.length):
                this.newEmptySite();
                break;
            case misc.chances(200 - npcSites.length * 4):
                this.newNpcSite();
                break;
        }
    }

    cycleStores () {
        // this.equipment.forEach(eq => {
        //     if (misc.chances(10)) {
        //         this.removeEquipment(eq);
        //     }
        // });
        while (this.equipment.length < 50) {
            const equipment = Equipment.generateRandomEquipment();
            this.addEquipment(equipment);
        }
    }

    getEquipment () {
        return this.equipment;
    }

    addEquipment (eq) {
        this.equipment.push(eq);
        eq.setRegion(this);
    }

    removeEquipment (eq) {
        const idx = this.equipment.indexOf(eq);
        this.equipment.splice(idx, 1);
        eq.setRegion(null);
    }

    newEmptySite () {
        const site = new Site({name: 'Barracks', region: this});
        site.makeAvailable(true);
        this.addSite(site);
    }

    newNpcSite () {
        const site = new npcSites.coalMine({region: this});
        site.setOwnedByNpc(true);
        new Fact(25, 'A new %s was opened in %s', site, this);
        this.addSite(site);
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
