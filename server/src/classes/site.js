const Entity = require('./entity');
const Item = require('./item');
const ItemsFactory = require('../factories/items/.index.js');
const service = require('../singletons/service');
const misc = require('../singletons/misc');
const world = require('../singletons/world');
const errorResponse = require('../functions/error-response');

class Site extends Entity {
    constructor (args) {
        super(args);
        this.name = args.name;
        this.region = args.region;
        if (args.region) {
            this.region.addSite(this);
        }
        this.owner = null;
        this.purchasable = args.purchasable;
        this.organisable = args.organisable || false;
        this.organisation = null;
        this.size = args.size || 5;
        this.space = this.getSize();
        this.destroyed = false;
        this.visibility = args.visibility || Math.ceil(Math.random() * 100);
        this.staff = [];
        this.equipment = [];
        this.relatedMission = null;
        this.wares = {};
        this.wareTypes = args.wareTypes;

        this.maintenance = this.getSize() * 50;
    }

    getVisibility() {
        return this.visibility;
    }

    getSize() {
        return this.size;
    }

    getMaintenance() {
        return this.maintenance;
    }

    updateMaintenance(change) {
        const owner = this.getOwner();
        if (owner) {
            owner.changeMaintenance(change);
        }
        this.maintenance = this.maintenance + change;
    }

    setOrganisation(organisation) {
        this.organisation = organisation;
        this.updated();
    }

    getOrganisation() {
        return this.organisation;
    }

    cycle (cycle) {
        if (cycle.weekly) {
            this.cycleProducts();
        }
    }

    cycleProducts () {
        if (this.wareTypes) {
            this.wareTypes.forEach((wareType) => {
                switch (wareType) {
                    case STATICS.SITES.OFFERS.WEAPONS:
                        this.wares[wareType] = this.wares[wareType] || [];
                        while (this.wares[wareType].length < 10 + this.getSize() * 5) {
                            this.addWare(wareType, ItemsFactory.knife());
                        }
                        break;
                }
            });
        }
    }

    useSpace (space) {
        if (this.space >= space) {
            this.space -= space;
            return true;
        }
        return false;
    }

    freeSpace (space) {
        this.space += space;
        return true;
    }

    getName () {
        return this.name;
    }

    isOccupied () {
        return !!this.owner || !!this.organisation;
    }

    setSize (value) {
        this.size = value;
    }

    setOwner (owner) {
        if (this.owner) {
            this.owner.changeMaintenance(-this.getMaintenance());
        }
        this.owner = owner;
        if (this.owner) {
            this.owner.changeMaintenance(this.getMaintenance());
        }
        owner.addSite(this);
        this.countryProperty = null;
    }

    addStaff (staff) {
        this.staff.push(staff);
        staff.setSite(this);
        this.updated();
    }

    addWare (type, item) {
        this.wares[type] = this.wares[type] || [];
        this.wares[type].push(item);
        this.updated();
    }

    getPrice () {
        return 100000 + this.getSize() * 40000;
    }

    getRegion () {
        return this.region;
    }

    getWares () {
        return this.wares;
    }

    getWaresPayload (player) {
        const wares = this.getWares();
        const result = {};
        Object.keys(wares).forEach((type) => {
            result[type] = wares[type].map(item => item.getPayload(player));
        });
        return result;
    }

    getOwner(){
        return this.owner;
    }

    getStaff () {
        return this.staff;
    }

    hasSpace (space) {
        return this.space >= space;
    }

    installEquipment (equipment) {
        if (equipment.install(this)) {
            this.equipment.push(equipment);
        }
    }

    getEquipment () {
        return this.equipment;
    }

    isDestroyed () {
        return this.destroyed;
    }

    setRelatedMission (mission) {
        this.relatedMission = mission;
    }

    getRelatedMission () {
        return this.relatedMission;
    }

    getPayload (player) {
        const familiarity = player.getSiteFamiliarity(this);
        if (!familiarity) {
            return null;
        }
        const info = {
            id: this.getId(),
            name: this.name,
            region: this.getRegion().getId(),
            intelCost: misc.getIntelCost('site', familiarity)
        };
        switch (true) {
            case familiarity >= 3:
                info.equipment = this.getEquipment().map(item => item.getId());
                info.staff = this
                    .getStaff()
                    .map(staff => staff.getId());
                // fall-through
            case familiarity >= 2:
                info.owner = this.getOwner() ? this.getOwner().getId() : null;
                info.organisation = this.getOrganisation() ? this.getOrganisation().getId() : null;
                info.staffCount = this.getStaff().length;
                info.wares = this.getWaresPayload(player);
                // fall-through
            case familiarity >= 1:
                if (this.purchasable) {
                    info.price = this.getPrice();
                }
                info.size = this.getSize();
                info.occupied = this.isOccupied();
                // fall-through

        }
        return info;
    }
}

service.registerHandler('purchase', (params, player) => {
    const site = Site.getById(params.site);

    if (!player || !site) {
        return errorResponse('Invalid request');
    }

    if (site.isOccupied()) {
        return errorResponse('Trying to purchase occupied site');
    }

    const familiarity = player.getSiteFamiliarity(site);
    if (familiarity < 3) {
        return errorResponse('Trying to purchase site when lacking the info')
    }

    if (!player.pay(site.getPrice())) {
        return errorResponse('Not enough funds');
    }

    site.setOwner(player);
    return { result: true };
});

service.registerHandler('investigate-site', (params, player) => {
    const site = Site.getById(params.site);

    if (!player || !site) {
        return errorResponse('Invalid request');
    }

    if (!player.investigateSite(site)) {
        return errorResponse('Unable to investigate site');
    }

    site.updated(player);

    return { result: true };
});


Entity.registerClass(Site);
module.exports = Site;
