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
        this.staff = [];
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
        if (this.isDestroyed() || this.countryProperty) {
            return;
        }
        let region = this.getRegion();
        let owner = this.getOwner();
        let country = region.getCountry();
        let facts = country.getRelatedFacts();
        facts.forEach(fact => {
            if (!owner.getFacts()[fact.id] && misc.chances(fact.getDiscoverability())) {
                owner.getFacts()[fact.id] = fact;
                service.sendUpdate('news', owner, fact.getFormatted());
            }
        });
        let missions = region.getMissions();
        missions.forEach(mission => {
            if(!owner.isMissionKnown(mission) && misc.chances(mission.getDiscoverability())){
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
