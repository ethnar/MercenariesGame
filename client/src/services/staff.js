import {ServerService} from '../services/server.js'

export const StaffService = {
    getStaffStream () {
        return ServerService.getListStream('Staff'); // TODO: list your own sites here? Just go by SiteID maybe?
    }
};
