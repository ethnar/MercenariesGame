define('services/player', ['services/server'], function (ServerService) {

    return {
        getIdStream () {
            return this.getStream().map(player => player.id);
        },

        getFundsStream () {
            return this.getStream().map(player => ({
                value: player.funds,
                delta: player.fundsDelta
            }));
        },

        getIntelStream () {
            return this.getStream().map(player => ({
                value: player.intel,
                delta: player.intelDelta,
                cap: player.intelCap
            }));
        },

        getStream () {
            return ServerService.getStream('player');
        }
    };

});