define('services/equipment', ['services/server'], function (ServerService) {

    return {
        getAvailableEquipmentStream (regionId) {
            return ServerService
                .getListStream('available-equipment')
                .map(equipmentList => {
                    console.log(equipmentList);
                    return equipmentList.filter(eq => eq.region === regionId)
                });
        },

        getEquipmentStream (siteId) {
            return ServerService
                .getListStream('equipment')
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

});