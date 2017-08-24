define('services/player', ['services/server'], function (ServerService) {

    return {
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
            return ServerService.getStream('Player', ServerService.getPlayerId());
        }
    };

});