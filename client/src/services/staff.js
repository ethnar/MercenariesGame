define('services/staff', ['services/server'], function (ServerService) {
    return {
        getStaffStream () {
            return ServerService.getListStream('Staff'); // TODO: list your own sites here? Just go by SiteID maybe?
        }
    };
});
