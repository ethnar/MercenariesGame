define('services/recruits', ['services/server'], function (ServerService) {

    return {
        getRecruitsStream (regionId) {
            return ServerService.getListStream('recruits');
        },

        recruit (recruitId, siteId) {
            return ServerService.request('recruit', {
                staff: recruitId,
                site: siteId
            });
        }
    };

});