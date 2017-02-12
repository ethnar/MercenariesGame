const Entity = require('./entity');
const Worldview = require('./worldview');
const world = require('../singletons/world');
const service = require('../singletons/service');
const crypto = require('crypto');

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

    getFunds () {
        return this.funds;
    }

    addFunds (funds) {
        this.funds += funds;
        service.sendUpdate('funds', this, this.funds);
    }

    pay (funds) {
        if (this.funds >= funds) {
            this.funds -= funds;
            service.sendUpdate('funds', this, this.funds);
            return true;
        }
        return false;
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
        service.sendUpdate('current-missions', this, mission.getPayload());
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
        service.sendUpdate('known-missions', this, mission.getPayload());
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

service.registerHandler('funds', (params, player) => {
    if (player) {
        return player.getFunds();
    }
    return null;
});

Entity.registerClass(Player);
module.exports = Player;
