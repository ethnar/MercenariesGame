class World {
	constructor () {
        this.players = [];

        global.service.registerHandler('authenticate', (params, previousPlayer, conn) => {
            let player = this.players.find((player) => {
                return player.verifyUsernameAndPassword(params.user, params.password);
            });
            if (player) {
                global.service.setPlayer(conn, player);
            }
            return !!player;
        });
    }

	getService () {
	    return this.service;
    }

    getPlayers () {
        return this.players;
    }

    run () {
        this.loop();
    }

    loop () {
        this.cycle();
        setTimeout(this.loop.bind(this), 1000);
    }

    cycle () {
    }
}

module.exports = World;
