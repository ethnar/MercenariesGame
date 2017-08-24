define('services/sites', ['services/server', 'services/player'], function (ServerService, PlayerService) {

    return {
        getSitesStream () {
            return ServerService.getListStream('Site');
        },

        getSiteStream (siteId) {
            return this.getSitesStream().map(sites => sites.find(site => site.id === siteId));
        },

        getOwnSitesStream () {
            return Rx.Observable.combineLatest(
                this.getSitesStream(),
                PlayerService.getIdStream()
            ).map(([sites, playerId]) => sites.filter(site => site.owner === playerId));
        },

        purchase (siteId) {
            return ServerService.request('purchase', {
                site: siteId
            });
        },

        investigate (site) {
            return ServerService.request('investigate-site', {
                site: site.id
            });
        }
    };

});
