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
        this.countryProperty = null;
        this.size = 15;
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

    freeSpace () {
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
        service.sendUpdate('sites', this.getOwner(), this.getPayload(this.getOwner()));
    }

    getPrice () {
        return this.size * 100;
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

    gatherIntelligence () {
        let owner = this.getOwner();
        if (this.isDestroyed() || !owner) {
            return;
        }
        owner.addIntel(5000000);
        // let region = this.getRegion();
        // let country = region.getCountry();
        // let facts = country.getRelatedFacts();
        // facts = facts.concat(region.getRelatedFacts());
        // facts.forEach(fact => {
        //     if (!owner.isFactKnown(fact) && misc.chances(fact.getDiscoverability())) {
        //         owner.addKnownFact(fact);
        //     }
        // });
        // let missions = region.getMissions();
        // missions.forEach(mission => {
        //     if(!owner.isMissionKnown(mission) && !mission.isWithdrawn() && misc.chances(mission.getDiscoverability())){
        //         owner.addKnownMission(mission);
        //     }
        // });
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
            price: this.getPrice(),
            intelCost: misc.getIntelCost('site', familiarity)
        };
        switch (true) {
            case familiarity >= 10:
                info.staffCount = this.getStaff().length;
                // fall-through
            case familiarity >= 5:
                info.owner = this.getOwner() ? this.getOwner().getId() : null;
        }
        return info;
    }
}

service.registerHandler('sites', (params, player) => {
    if (player)
    {
        let sites = player.getKnownSites();
        return sites.map(site => site.getPayload(player));
    }
    return [];
});

service.registerHandler('purchase', (params, player) => {
    const site = Site.getById(params.site);

    if (!player || !site) {
        return errorResponse('Invalid request');
    }

    if (site.isOccupied()) {
        return errorResponse('Trying to purchase occupied site');
    }

    if (!player.pay(site.getPrice())) {
        return errorResponse('Not enough funds');
    }

    site.setOwner(player);
    return { result: true };
});

Entity.registerClass(Site);
module.exports = Site;
