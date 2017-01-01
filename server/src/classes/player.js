let Entity = require('./entity');
let world = require('../singletons/world');
let service = require('../singletons/service');

// global.service.registerHandler('orderMove', (params, player) => {
//     try {
//         let fromTile = global.worldMap.getTile(params.from.x, params.from.y)
//         let toTile = global.worldMap.getTile(params.to.x, params.to.y)
//         if (!fromTile.getArmy() || fromTile.getArmy().getOwner() !== player) {
//             console.error('Hacking attempt?');
//             console.log(params);
//             console.log(player);
//             return null;
//         }
//         fromTile.getArmy().orderMove(toTile);
//         return true;
//     } catch (e) {
//         console.error(e);
//     }
// });

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

global.Player = Player;
module.exports = Player;
