import {ServerService} from '../services/server.js'

export const EquipmentService = {
    getAvailableEquipmentStream (regionId) {
        return ServerService
            .getListStream('Equipment')
            .map(equipmentList => {
                return equipmentList.filter(eq => eq.region === regionId)
            });
    },

    getEquipmentStream (siteId) {
        return ServerService
            .getListStream('Equipment')
            .map(equipmentList => equipmentList.filter(eq => eq.site === siteId));
    },

    purchase (siteId, equipmentId) {
        return ServerService
            .request('purchase-equipment', {
                site: siteId,
                equipment: equipmentId
            });
    }
};
