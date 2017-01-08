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

class Player extends Entity {
    constructor (name, password, npc) {
        super();

        this.name = name;
        this.password = Player.passwordHash(password);
        this.npc = !!npc;
    }

    static passwordHash (password) {
        const shasum = crypto.createHash('sha1');
        shasum.update(password + '-mercenaries-game');
        return shasum.digest('hex');
    }

    getName () {
        return this.name;
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === Player.passwordHash(password) && this.name === name;
    }
}

Entity.registerClass(Player);
module.exports = Player;
