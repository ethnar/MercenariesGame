define('services/sites', ['services/server'], function (ServerService) {

    return {
        getSitesStream () {
            return ServerService.getListStream('sites')
        },

        getSiteStream (siteId) {
            return this.getSitesStream().map(sites => sites.find(site => site.id === siteId));
        }
    };

});