const Entity = require('./entity');
const Human = require('./human');
const Mission = require('./mission.js');
const misc = require('../singletons/misc');
const world = require('../singletons/world');
const Fact = require('./fact');

class Politician extends Human {
    constructor (args) {
        super(args);

        args = args || {};

        this.country = args.country;
        this.missions = [];
    }

    cycle (cycles) {
        if (cycles.regular && misc.chances(100 - 25 * this.missions.length)) { //4 missions cap per politician
            this.generateMission();
        }
    }

    generateMission () {
        const region = misc.randomEntity(this.country.regions);
        const eligibleSites = region
            .getSites()
            .filter(site => {
                const organisation = site.getOrganisation();
                return organisation && organisation.getWorldview().getAlignScore(this.getWorldview()) !== 0;
            })
            .filter(site => !site.getRelatedMission());

        if (eligibleSites.length) {
            const site = misc.randomEntity(eligibleSites);

            const organisation = site.getOrganisation();
            const alignmentScore = organisation.getWorldview().getAlignScore(this.getWorldview());

            const description = (alignmentScore > 0) ? 'Provide protection for ' + site.getName() : 'Assault ' + site.getName();
            const newMission = new Mission({
                owner: this,
                description: description,
                site: site,
                deadline: Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24), //within 24h
            });
            this.missions.push(newMission);
        }
    }

    withdrawMission (mission) {
        const idx = this.missions.findIndex(m => m === mission);
        mission.setWithdrawn(true);
    }

    getPayload(player) {
        const data = super.getPayload(player);
        return data;
    }
}

Entity.registerClass(Politician);
module.exports = Politician;
