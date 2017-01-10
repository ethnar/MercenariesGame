define('services/missions', ['services/server'], function (ServerService) {

    return {
        getAvailableMissionsStream () {
            return ServerService.getListStream('available-missions');
        },

        getCurrentMissionsStream () {
            return ServerService.getListStream('current-missions');
        }
    };

});