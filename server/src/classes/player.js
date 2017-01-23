const Entity = require('./entity');
const Worldview = require('./worldview');
const world = require('../singletons/world');
const service = require('../singletons/service');
const crypto = require('crypto');

service.registerHandler('authenticate', (params, previousPlayer, conn) => {
    let player = world.getEntitiesArray('Player').find(player => {
        return player.verifyUsernameAndPassword(params.user, params.password);
    });
    if (player) {
        service.setPlayer(conn, player);
    }
    return !!player;
});

class Player extends Entity {
    constructor (name, password, npc) {
        super();

        this.name = name;
        this.password = Player.passwordHash(password);
        this.npc = !!npc;
        this.worldview = new Worldview();

        this.knownMissions = {};
        this.currentMissions = {};
        this.knownFacts = {};
        this.money = 0;
        this.sites = [];
    }

    static passwordHash (password) {
        const shasum = crypto.createHash('sha1');
        shasum.update(password + '-mercenaries-game');
        return shasum.digest('hex');
    }

    addSite (site) {
        this.sites.push(site);
    }

    getSites () {
        return this.sites;
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

    cycle () {
        this.gatherIntelligence();
    }

    gatherIntelligence () {
        this.sites.forEach(site => {
            site.gatherIntelligence();
        });
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

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === Player.passwordHash(password) && this.name === name;
    }

    isMissionKnown(mission){
        return !!this.getKnownMissions()[mission.id];
    }

    addKnownMission(mission){
        this.knownMissions[mission.id] = mission;
        service.sendUpdate('known-missions', this, mission.getPayload());
    }

    isFactKnown(fact){
        return !!this.getKnownFacts()[fact.id]
    }

    addKnownFact(fact){
        this.knownFacts[fact.id] = fact;
        service.sendUpdate('news', this, fact.getFormatted());
    }
}

Entity.registerClass(Player);
module.exports = Player;
