import {ServerService} from '../services/server.js'

export const RegionsService = {
    getRegionsStream () {
        return ServerService.getListStream('Region');
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
