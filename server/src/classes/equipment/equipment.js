const Entity = require('../entity');
const Site = require('../site');
const service = require('../../singletons/service');
const world = require('../../singletons/world');
const errorResponse = require('../../functions/error-response');

class Equipment extends Entity {

    constructor (args) {
        super(args);

        this.region = args.region;
        this.site = args.site;
    }

    setRegion (region) {
        if (this.region) {
            service.sendDeletion('available-equipment', this.region.getCoveringPlayers(), this.getId());
        }
        this.region = region;
        if (region) {
            service.sendUpdate('available-equipment', region.getCoveringPlayers(), this.getPayload());
        }
    }

    install (site) {
        this.site = site;
        service.sendUpdate('equipment', site.getOwner(), this.getPayload());
        return site.useSpace(this.space);
    }

    uninstall (site) {
        return site.freeSpace(this.space);
    }

    getSpace () {
        return this.space;
    }

    getPrice () {
        return this.price;
    }

    getRegion () {
        return this.region;
    }

    getSite () {
        return this.site;
    }

    getPayload () {
        return {
            id: this.getId(),
            name: this.name,
            region: this.region ? this.region.getId() : undefined,
            site: this.site ? this.site.getId() : undefined
        }
    }

    static generateRandomEquipment () {
        const BunkBeds = require('./bunk-beds');
        return new BunkBeds();
    }
}

service.registerHandler('available-equipment', (params, player) => {
    if (player) {
        let equipment = [];
        const regions = player.getCoveredRegions();
        regions.forEach(region => {
            const regionEquipment = region
                .getEquipment()
                .map(eq => eq.getPayload());
            equipment = equipment.concat(regionEquipment);
        });
        return equipment;
    }
});

service.registerHandler('equipment', (params, player) => {
    if (player) {
        let equipment = [];
        const sites = player.getSites();
        sites.forEach(site => {
            const siteEquipment = site
            .getEquipment()
            .map(eq => eq.getPayload());
            equipment = equipment.concat(siteEquipment);
        });
        return equipment;
    }
});

service.registerHandler('purchase-equipment', (params, player) => {
    const site = Site.getById(params.site);
    const equipment = Equipment.getById(params.equipment);

    if (!player || !site || !equipment) {
        return errorResponse('Invalid request');
    }
    if (site.getOwner() !== player) {
        return errorResponse('Managing non-owned site');
    }
    if (equipment.getSite()) {
        return errorResponse('This equipment is not for sale');
    }
    if (equipment.getRegion() !== site.getRegion()) {
        return errorResponse('You cannot import equipment from other regions');
    }

    if (!site.hasSpace(equipment.getSpace())) {
        return errorResponse('Not enough space');
    }
    if (!player.pay(equipment.getPrice())) {
        return errorResponse('Not enough funds');
    }

    site.getRegion().removeEquipment(equipment);
    site.installEquipment(equipment);

    return { result: true };
});

Entity.registerClass(Equipment);
module.exports = Equipment;
