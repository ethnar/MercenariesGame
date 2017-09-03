const Entity = require('./entity');
const Politician = require('./politician');
const Worldview = require('./worldview');
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

        this.worldview = Worldview.generateRandom();
    }

    getPoliticians () {
        return this.politicians;
    }

    getLabel () {
        return this.name;
    }

    getWorldview () {
        return this.worldview;
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
                this.elections = true;
                break;
            case this.elections && this.politicians.length > 3 && misc.chances(10):
                this.ruler = this.politicians.pop();
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
                }
                break;
            case cycles.daily && misc.chances(20 - this.politicians.length * 3):
                this.newPolitician();
                break;
        }
    }

    newPolitician () {
        const region = misc.randomEntity(this.regions);
        const newGuy = new Politician({region: region, country: this});
        this.politicians.push(newGuy);
    }
}

Entity.registerClass(Country);
module.exports = Country;
