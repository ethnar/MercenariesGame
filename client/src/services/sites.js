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
        },

        getAvailableSiteStream (siteId) {
            return this.getAvailableSitesStream().map(sites => sites.find(site => site.id === siteId));
        },

        getSiteStream (siteId) {
            return Rx.Observable.combineLatest([
                this.getAvailableSiteStream(siteId),
                this.getOwnSiteStream(siteId)
            ]).map(([available, own]) => {
                if (available) {
                    return Object.assign({}, available, { available: true });
                } else {
                    return Object.assign({}, own, { owned: true });
                }
            });
        },

        purchase (siteId) {
            return ServerService.request('purchase', {
                site: siteId
            });
        }
    };

});