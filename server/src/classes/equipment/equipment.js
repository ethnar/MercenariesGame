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
            this.region.updated();
        }
        this.region = region;
        if (region) {
            region.updated();
        }
        this.updated();
    }

    install (site) {
        if (site.useSpace(this.space)) {
            this.site = site;
            site.updated();
            this.updated();
            return true;
        }
        return false;
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

    getPayload (player) {
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
