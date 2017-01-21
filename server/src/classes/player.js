const Entity = require('./entity');
const Worldview = require('./worldview');
const world = require('../singletons/world');
const service = require('../singletons/service');
const crypto = require('crypto');

service.registerHandler('authenticate', (params, previousPlayer, conn) => {
    let player = world.entities.Player.find(player => {
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

    getFacts () {
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
        //console.log('Player' + this.name + ' learned about mission: ' + mission.id + ': ' + mission.description);
        this.knownMissions[mission.id] = mission;
        //service.sendUpdate('missions', this, mission.getFormatted());
    }
}

Entity.registerClass(Player);
module.exports = Player;
