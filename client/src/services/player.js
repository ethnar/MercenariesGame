define('services/player', ['services/server'], function (ServerService) {

    return {
        getFundsStream () {
            return ServerService.getStream('funds');
        }
    };

});