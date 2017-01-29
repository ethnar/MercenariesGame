const Entity = require('./entity');
const service = require('../singletons/service');
const misc = require('../singletons/misc');

class Site extends Entity {
    constructor (name, region) {
        super();
        this.name = name;
        this.region = region;
        if (region) {
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

    setStandard (value) {
        this.standard = value;
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
        service.sendUpdate('sites', this.getOwner(), this.getPayload());
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
            staffCount: this.getStaff().length
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

Entity.registerClass(Site);
module.exports = Site;
