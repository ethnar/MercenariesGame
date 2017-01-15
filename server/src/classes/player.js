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

        this.availableMissions = {};
        this.currentMissions = {};
        this.money = 0;
        this.knownFacts = {};
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

    getAvailableMissions () {
        return this.availableMissions;
    }

    getCurrentMissions () {
        return this.currentMissions;
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === Player.passwordHash(password) && this.name === name;
    }
}

Entity.registerClass(Player);
module.exports = Player;
