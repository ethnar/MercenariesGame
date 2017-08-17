const Entity = require('./entity');
const Worldview = require('./worldview');
const world = require('../singletons/world');
const service = require('../singletons/service');
const crypto = require('crypto');
const misc = require('../singletons/misc');

class Player extends Entity {
    constructor (name, password, npc) {
        super();

        this.name = name;
        this.password = Player.passwordHash(password);
        this.npc = !!npc;
        this.worldview = new Worldview(50);

        this.knownMissions = {};
        this.currentMissions = {};
        this.knownFacts = {};
        this.funds = 0;
        this.fundsDelta = 0;
        this.intel = 0;
        this.intelDelta = 10;
        this.intelCap = 1000;
        this.siteKnowledge = {};
        this.regionKnowledge = {};
        //this.politiciansKnowledge = {};
        this.sites = [];
    }

    static passwordHash (password) {
        const shasum = crypto.createHash('sha1');
        shasum.update(password + '-mercenaries-game');
        return shasum.digest('hex');
    }

    addSite (site) {
        this.sites.push(site);
        this.siteKnowledge[site.id] = {
            familiarity: 10,
            site
        };
        service.sendUpdate('sites', this, site.getPayload(this));
    }

    cycle (cycles) {
        if (cycles.regular) {
            this.gatherIntelligence();
        }
    }

    gatherIntelligence () {
        this.addIntel(this.getIntelDelta());
    }

    getFunds () {
        return this.funds;
    }

    getFundsDelta () {
        return this.fundsDelta;
    }

    getIntel () {
        return this.intel;
    }

    getIntelDelta () {
        return this.intelDelta;
    }

    addIntel (intel) {
        this.intel = Math.min(this.intel + intel, this.intelCap);
        service.sendUpdate('player', this, this.getPayload(this));
    }

    useIntel (intel) {
        if (this.intel >= intel) {
            this.intel -= intel;
            service.sendUpdate('player', this, this.getPayload(this));
            return true;
        }
        return false;
    }

    investigateRegion(region) {
        const knowledge = this.regionKnowledge[region.id] || {
            familiarity: 0,
            region
        };
        this.regionKnowledge[region.id] = knowledge;
        if (knowledge.familiarity < 10) {
            const intelNeeded = misc.getIntelCost('region', knowledge.familiarity);
            if (this.useIntel(intelNeeded)) {
                knowledge.familiarity = knowledge.familiarity + 1;
                service.sendUpdate('regions', this, region.getPayload(this));

                const sites = [...region.getSites()];

                sites.sort((a, b) => {
                    return b.getVisibility() - a.getVisibility();
                });

                let reveal = Math.ceil(sites.length * (knowledge.familiarity + Math.random() * 0.2) / 10);
                reveal = Math.min(reveal, sites.length);

                for (let i = 0; i < reveal; i++) {
                    if (this.getSiteFamiliarity(sites[i]) < 1) {
                        this.revealSite(sites[i], 1);
                    }
                }
                return true;
            }
        }
        return false;
    }

    investigateSite(site) {
        const knowledge = this.siteKnowledge[site.id] || {
            familiarity: 0,
            site
        };
        this.siteKnowledge[site.id] = knowledge;
        if (knowledge.familiarity < 10) {
            const intelNeeded = misc.getIntelCost('site', knowledge.familiarity);
            if (this.useIntel(intelNeeded)) {
                knowledge.familiarity = knowledge.familiarity + 1;
                service.sendUpdate('sites', this, site.getPayload(this));
                return true;
            }
        }
        return false;
    }

    investigatePolitician(politician) {

    }

    revealSite(site, familiarity = 10) {
        this.siteKnowledge[site.getId()] = {
            familiarity,
            site
        };
        service.sendUpdateCB('sites', this, site.getPayload.bind(site));
    }

    addFunds (funds) {
        this.funds += funds;
        service.sendUpdate('player', this, this.getPayload(this));
    }

    pay (funds) {
        if (this.funds >= funds) {
            this.funds -= funds;
            service.sendUpdate('player', this, this.getPayload(this));
            return true;
        }
        return false;
    }

    getSites () {
        return this.sites;
    }

    getKnownSites () {
        return misc.toArray(this.siteKnowledge).map(item => item.site);
    }

    getSiteFamiliarity (site) {
        return this.siteKnowledge[site.id] ? this.siteKnowledge[site.id].familiarity : 0;
    }

    getRegionFamiliarity (region) {
        return this.regionKnowledge[region.id] ? this.regionKnowledge[region.id].familiarity : 0;
    }

    getStaff () {
        let result = [];
        this.getSites().forEach(site => {
            result = result.concat(site.getStaff())
        });
        return result;
    }

    getCoveredRegions () {
        let regions = {};
        this.getSites().forEach(site => {
            regions[site.getRegion().getId()] = site.getRegion();
        });
        return Object.keys(regions).map(id => regions[id]);
    }

    isCoveringRegion (region) {
        return !!this.getSites().find(site => site.getRegion() === region);
    }

    getName () {
        return this.name;
    }

    getKnownFacts () {
        return this.knownFacts;
    }

    getKnownMissions () {
        return this.knownMissions;
    }

    getCurrentMissions () {
        return this.currentMissions;
    }

    startedMission (mission) {
        this.currentMissions[mission.id] = mission;
        service.sendUpdate('current-missions', this, mission.getPayload(this));
    }

    finishedMission (mission) {
        delete this.currentMissions[mission.id];
        service.sendDeletion('current-missions', this, mission.getId());
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === Player.passwordHash(password) && this.name === name;
    }

    isMissionKnown(mission){
        return !!this.getKnownMissions()[mission.id];
    }

    addKnownMission(mission){
        this.knownMissions[mission.id] = mission;
        service.sendUpdate('known-missions', this, mission.getPayload(this));
    }

    forgetMission (mission) {
        delete this.knownMissions[mission.id];
        service.sendDeletion('known-missions', this, mission.getId());
    }

    isFactKnown(fact){
        return !!this.getKnownFacts()[fact.id]
    }

    addKnownFact(fact){
        this.knownFacts[fact.id] = fact;
        service.sendUpdate('news', this, fact.getFormatted());
    }

    getPayload () {
        return {
            id: this.getId(),
            funds: this.getFunds(),
            intel: this.getIntel(),
            fundsDelta: this.getFundsDelta(),
            intelDelta: this.getIntelDelta(),
            intelCap: this.intelCap
        }
    }
}

service.registerHandler('authenticate', (params, previousPlayer, conn) => {
    let player = world.getEntitiesArray('Player').find(player => {
        return player.verifyUsernameAndPassword(params.user, params.password);
    });
    if (player) {
        service.setPlayer(conn, player);
    }
    return !!player;
});

service.registerHandler('player', (params, player) => {
    if (player) {
        return player.getPayload(player);
    }
    return null;
});

Entity.registerClass(Player);
module.exports = Player;
