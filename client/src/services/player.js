import {ServerService} from '../services/server.js'

export const PlayerService = {
    getIdStream () {
        return this.getCurrentPlayerStream().map(player => player.id);
    },

    getFundsStream () {
        return this.getCurrentPlayerStream().map(player => ({
            value: player.funds,
            delta: player.fundsDelta
        }));
    },

    getIntelStream () {
        return this.getCurrentPlayerStream().map(player => ({
            value: player.intel,
            delta: player.intelDelta,
            cap: player.intelCap
        }));
    },

    getCurrentPlayerStream () {
        const playerId = ServerService.getPlayerId();
        if (playerId) {
            return ServerService.getStream('Player', playerId);
        }
        window.location = '?token=' + Math.random() + '#/login';
    }
};
