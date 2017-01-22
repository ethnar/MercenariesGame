define('services/sites', ['services/server'], function (ServerService) {

    return {
        getSitesStream () {
            return ServerService.getListStream('sites')
        }
    };

});