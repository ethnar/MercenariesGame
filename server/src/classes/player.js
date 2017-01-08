let Entity = require('./entity');
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

service.registerHandler('news', (params, player) => {
    if (player)
    {
        return player.getFacts().map(fact => fact.getFormatted());
    }
    return [];
});

class Player extends Entity {
    constructor (name, password, npc) {
        super();

        this.name = name;
        this.password = Player.passwordHash(password);
        this.npc = !!npc;

        this.knownFacts = [];
    }

    static passwordHash (password) {
        const shasum = crypto.createHash('sha1');
        shasum.update(password + '-mercenaries-game');
        return shasum.digest('hex');
    }

    getName () {
        return this.name;
    }

    getFacts () {
        return this.knownFacts;
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === Player.passwordHash(password) && this.name === name;
    }
}

Entity.registerClass(Player);
module.exports = Player;
