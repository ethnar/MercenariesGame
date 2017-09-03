const Entity = require('./entity');
const Item = require('./item');
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
        this.space = this.size;
        this.destroyed = false;
        this.visibility = args.visibility || Math.ceil(Math.random() * 100);
        this.staff = [];
        this.equipment = [];
        this.relatedMission = null;
        this.wares = [];

        this.maintenance = this.size * 50;
    }

    getVisibility() {
        return this.visibility;
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
                    case Site.OFFERS.WEAPONS:
                        while (this.wares.length < 20) {
                            this.wares.push(new Item({
                                slot: STATICS.ITEMS.SLOTS.WEAPON,
                            }))
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

    getPrice () {
        return 100000 + this.size * 40000;
    }

    getRegion () {
        return this.region;
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
                // fall-through
            case familiarity >= 1:
                if (this.purchasable) {
                    info.price = this.getPrice();
                }
                info.size = this.size;
                info.occupied = this.isOccupied();
                // fall-through

        }
        return info;
    }
}

Site.OFFERS = {
    GENERAL: 1,
    PERSONNEL: 2,
    WEAPONS: 3,
};

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
        return errorResponse('Unable to investigate region');
    }

    site.updated(player);

    return { result: true };
});


Entity.registerClass(Site);
module.exports = Site;
