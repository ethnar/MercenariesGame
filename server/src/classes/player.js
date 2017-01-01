let Entity = require('./entity');

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

class Player extends Entity {
    constructor (name, password, npc) {
        super('players');

        this.name = name;
        this.password = password;
        this.npc = !!npc;
    }

    getName () {
        return this.name;
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === password && this.name === name;
    }
}

module.exports = Player;
