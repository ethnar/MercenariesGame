define('services/player', ['services/server'], function (ServerService) {

    return {
        getFundsStream () {
            return ServerService.getStream('funds');
        },

        getIntelStream () {
            return ServerService.getStream('intel');
        }
    };

});