define('services/regions', ['services/server'], function (ServerService) {
    return {
        getRegionsStream () {
            return ServerService.getListStream('regions');
        },

        getRegionStream (regionId) {
            return this
                .getRegionsStream()
                .map(regions => regions.find(region => region.id === regionId))
        },

        investigate(region) {
            return ServerService.request('investigate-region', {
                region: region.id
            });
        }
    };

});