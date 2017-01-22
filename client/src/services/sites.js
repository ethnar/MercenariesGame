define('services/sites', ['services/server', 'services/regions'], function (ServerService, RegionsService) {

    return {
        getSitesStream () {
            return ServerService.getListStream('sites')
        }
    };

});