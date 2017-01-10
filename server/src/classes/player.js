let Entity = require('./entity');
const Worldview = require('./worldview');
let world = require('../singletons/world');
let service = require('../singletons/service');
let crypto = require('crypto');

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
            let region = site.getRegion();
            let country = region.getCountry();
            let facts = country.getRelatedFacts();
            facts.forEach(fact => {
                if (!this.knownFacts[fact.id]) { // TODO: add a chance here
                    this.knownFacts[fact.id] = fact;
                    service.sendUpdate('news', this, fact.getFormatted());
                }
            });
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
