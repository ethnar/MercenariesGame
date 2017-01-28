define('services/missions', ['services/server'], function (ServerService) {

    return {
        getKnownMissionsStream () {
            return ServerService.getListStream('known-missions');
        },

        getCurrentMissionsStream () {
            return ServerService.getListStream('current-missions');
        }
    };

});