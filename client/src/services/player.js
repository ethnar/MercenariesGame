define('services/player', ['services/server'], function (ServerService) {

    return {
        getIdStream () {
            return this.getStream().map(player => player.id);
        },

        getFundsStream () {
            return this.getStream().map(player => player.funds);
        },

        getIntelStream () {
            return this.getStream().map(player => player.intel);
        },

        getStream () {
            return ServerService.getStream('player');
        }
    };

});