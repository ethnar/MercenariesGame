let Entity = require('./entity');
let world = require('../singletons/world');
let service = require('../singletons/service');

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
        super('Player');

        this.name = name;
        this.password = password;
        this.npc = !!npc;
        this.self = this;
    }

    getName () {
        return this.name;
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === password && this.name === name;
    }
}

Entity.registerClass(Player);
module.exports = Player;
