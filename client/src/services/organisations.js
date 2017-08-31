import {ServerService} from '../services/server.js'

export const OrganisationsService = {
    getOrganisationsStream () {
        return ServerService.getListStream('Organisation');
    },

    getOrganisationStream (organisationId) {
        return ServerService.getStream('Organisation', organisationId);
    },
};
