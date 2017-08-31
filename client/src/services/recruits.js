import {ServerService} from '../services/server.js'

export const RecruitsService = {
    getRecruitsStream (siteId) { // TODO: that'll make for an inconvenient recruitment UI, needs to be region-based
        return ServerService.getListStream('Staff', { site: siteId });
    },

    recruit (recruitId, siteId) {
        return ServerService.request('recruit', {
            staff: recruitId,
            site: siteId
        });
    }
};
