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
        this.standard = 50;
        this.size = 1;
        this.destroyed = false;
        this.npcOwned = false;
        this.staff = [];
    }

    cycle (cycles) {
        if (cycles.regular) {
            this.gatherIntelligence();
        }
    }

    getLabel () {
        return this.name;
    }

    isOccupied () {
        return !!this.npcOwned || !!this.owner;
    }

    setStandard (value) {
        this.standard = value;
    }

    setSize (value) {
        this.size = value;
    }

    setOwner (owner) {
        this.owner = owner;
        this.makeAvailable(false);
        owner.addSite(this);
        this.countryProperty = null;
    }

    setOwnedByNpc (isOwned) {
        this.npcOwned = isOwned;
        this.makeAvailable(!isOwned);
    }

    makeAvailable (available) {
        if (available) {
            service.sendUpdate('available-sites', null, this.getPayload());
        } else {
            service.sendDeletion('available-sites', null, this.getId());
        }
    }

    addStaff (staff) {
        this.staff.push(staff);
        staff.setSite(this);
        service.sendUpdate('sites', this.getOwner(), this.getPayload());
    }

    getPrice () {
        return 1000;
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
        let region = this.getRegion();
        let country = region.getCountry();
        let facts = country.getRelatedFacts();
        facts = facts.concat(region.getRelatedFacts());
        facts.forEach(fact => {
            if (!owner.isFactKnown(fact) && misc.chances(fact.getDiscoverability())) {
                owner.addKnownFact(fact);
            }
        });
        let missions = region.getMissions();
        missions.forEach(mission => {
            if(!owner.isMissionKnown(mission) && !mission.isWithdrawn() && misc.chances(mission.getDiscoverability())){
                owner.addKnownMission(mission);
            }
        });
    }

    isDestroyed () {
        return this.destroyed;
    }

    getPayload () {
        return {
            id: this.getId(),
            name: this.name,
            region: this.getRegion().getId(),
            staffCount: this.getStaff().length,
            price: this.getPrice()
        }
    }
}

service.registerHandler('sites', (params, player) => {
    if (player)
    {
        let sites = player.getSites();
        return sites.map(site => site.getPayload());
    }
    return [];
});

service.registerHandler('available-sites', (params, player) => {
    return world
        .getEntitiesArray('Site')
        .filter(site => !site.isOccupied())
        .map(site => site.getPayload());
});

service.registerHandler('purchase', (params, player) => {
    if (player) {
        const site = Site.getById(params.site);

        if (site.isOccupied()) {
            return errorResponse('Trying to purchase occupied site');
        }

        if (!player.pay(site.getPrice())) {
            return errorResponse('Not enough funds');
        }

        site.setOwner(player);
        return { result: true };
    }
});

Entity.registerClass(Site);
module.exports = Site;
