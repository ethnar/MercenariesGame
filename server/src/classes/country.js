const Entity = require('./entity');
const Fact = require('./fact');
const Politician = require('./politician');
const world = require('../singletons/world');
const misc = require('../singletons/misc');

class Country extends Entity {
    constructor (name) {
        super();
        this.name = name;
        this.ruler = null;
        this.seatOfPower = null;
        this.armyLeader = null;
        this.missions = [];
        this.politicians = [];
        this.regions = [];

        this.elections = false;
    }

    getLabel () {
        return this.name;
    }

    getPayload (player) {
        return {
            id: this.getId(),
            name: this.name
        }
    }

    setNameGenerator (nameGen) {
        this.nameGenerator = nameGen;
    }

    generateName () {
        if (this.nameGenerator) {
            return require('../name-generator/' + this.nameGenerator)();
        } else {
            return 'No-name';
        }
    }

    cycle (cycles) {
        this.generateEvents(cycles);
    }

    addRegion (region) {
        this.regions.push(region);
    }

    generateEvents (cycles) {
        switch (true) {
            case !this.elections && !this.ruler:
                new Fact(95, '%s is preparing elections', this);
                this.elections = true;
                break;
            case this.elections && this.politicians.length > 3 && misc.chances(10):
                this.ruler = this.politicians.pop();
                new Fact(98, '%s was elected leader of %s', this.ruler, this);
                this.elections = false;
                break;
            case this.ruler && !this.seatOfPower && misc.chances(80):
                let selected = null;
                this.regions.forEach(region => {
                    region.sites
                    .filter(site => !site.isOccupied())
                    .filter(site => site.size > 15)
                        .forEach(site => {
                            if (!selected || site.standard > selected.standard) {
                                selected = site;
                            }
                        });
                });
                if (selected) {
                    this.seatOfPower = selected;
                    new Fact(95, '%s has chosen %s as their seat of power.', this, selected);
                }
                break;
            case cycles.regular && misc.chances(100 - this.politicians.length * 5):
                this.newPolitician();
                break;
        }
    }

    newPolitician () {
        const region = misc.randomEntity(this.regions);
        const newGuy = new Politician({region: region, country: this});
        this.politicians.push(newGuy);
        new Fact(30, '%s joins the political scene of %s', newGuy, this);
    }
}

Entity.registerClass(Country);
module.exports = Country;
