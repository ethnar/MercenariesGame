const Entity = require('./entity');
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
        this.size = args.size || 5;
        this.space = this.size;
        this.destroyed = false;
        this.visibility = Math.ceil(Math.random() * 100);
        this.staff = [];
        this.equipment = [];
    }

    getVisibility() {
        return this.visibility;
    }

    cycle () {
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

    getLabel () {
        return this.name;
    }

    isOccupied () {
        return !!this.owner;
    }

    setSize (value) {
        this.size = value;
    }

    setOwner (owner) {
        this.owner = owner;
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
            case familiarity >= 10:
                info.equipment = this.getEquipment().map(item => item.getId());
                // fall-through
            case familiarity >= 9:
                info.owner = this.getOwner() ? this.getOwner().getId() : null;
                // fall-through
            case familiarity >= 8:
                // fall-through
            case familiarity >= 7:
                info.equipment = this
                    .getEquipment()
                    .filter(item => item.defenses)
                    .map(item => item.getId());
                // fall-through
            case familiarity >= 6:
                // fall-through
            case familiarity >= 5:
                info.staff = this
                    .getStaff()
                    .map(staff => staff.getId());
                // fall-through
            case familiarity >= 4:
                info.staffCount = this.getStaff().length;
                // fall-through
            case familiarity >= 3:
                info.price = this.getPrice();
                // fall-through
            case familiarity >= 2:
                info.occupied = !!this.getOwner();
                // fall-through
            case familiarity >= 1:
                info.size = this.size;
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
        return errorResponse('Unable to investigate region');
    }

    site.updated(player);

    return { result: true };
});


Entity.registerClass(Site);
module.exports = Site;
