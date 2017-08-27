define('services/organisations', ['services/server'], function (ServerService) {
    return {
        getOrganisationsStream () {
            return ServerService.getListStream('Organisation');
        },

        getOrganisationStream (organisationId) {
            return ServerService.getStream('Organisation', organisationId);
        },
    };

});