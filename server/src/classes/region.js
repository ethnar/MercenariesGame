const Entity = require('./entity');
const Worldview = require('./worldview');
const Staff = require('./staff');
const Fact = require('./fact');
const Site = require('./site');
const service = require('../singletons/service');
const world = require('../singletons/world');
const misc = require('../singletons/misc');
const errorResponse = require('../functions/error-response');

const Equipment = require('./equipment/equipment');

const npcSites = {
    mine: require('../factories/sites/mine')
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
        this.worldview = new Worldview(this.country.getWorldview());
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

    getPayload (player) {
        const familiarity = player.getRegionFamiliarity(this);
        return {
            id: this.getId(),
            name: this.name,
            country: this.getCountry().getId(),
            population: this.getPopulation(),
            intelCost: misc.getIntelCost('region', familiarity),
            //involvement: this.getInvolvement
        }
    }

    newRecruit () {
        const newGuy = new Staff({
            region: this
        });
        this.recruits.push(newGuy);
        const players = this.getCoveringPlayers();
    }

    withdrawRecruit (recruit) {
        const index = this.recruits.indexOf(recruit);
        this.recruits.splice(index, 1);
        const players = this.getCoveringPlayers();
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
}

service.registerHandler('investigate-region', (params, player) => {
    const region = Region.getById(params.region);

    if (!player || !region) {
        return errorResponse('Invalid request');
    }

    if (!player.investigateRegion(region)) {
        return errorResponse('Unable to investigate region');
    }

    region.updated(player);

    return { result: true };
});

Entity.registerClass(Region);
module.exports = Region;
