define('services/sites', ['services/server'], function (ServerService) {

    return {
        getOwnSitesStream () {
            return ServerService.getListStream('sites');
        },

        getOwnSiteStream (siteId) {
            return this.getOwnSitesStream().map(sites => sites.find(site => site.id === siteId));
        },

        getAvailableSitesStream () {
            return ServerService.getListStream('available-sites');
        }
    };

});