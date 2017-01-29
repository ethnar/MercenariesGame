const misc = require('../singletons/misc');

class Worldview {
    constructor (derivativeWorldview) {
        const dimensions = [
            'slavery',
            'environmentalism',
            'drugUse'
        ];

        dimensions.forEach(dimension => {
            if (derivativeWorldview) {
                if (typeof derivativeWorldview === 'number') {
                    this[dimension] = derivativeWorldview;
                } else {
                    this[dimension] = misc.gaussian(100, derivativeWorldview.get(dimension));
                }
            } else {
                this[dimension] = misc.gaussian(100);
            }
        });
    }

    get (section) {
        return this[section];
    }

    chances (section, rolls = 1) {
        let roll = this.get(section);
        roll = Math.min(roll, 99);
        roll = Math.max(roll, 1);
        let result = false;
        while (rolls > 0) {
            result = result || misc.chances(roll);
            rolls -= 1;
        }
        return result;
    }
}

module.exports = Worldview;
/*
assault
    factory -> slavery
    factory -> environmental damage
    drug plantation
    power plant (coal, atomic, wind, hydro, solar)
    mine (coal, uranium, iron)
rescue
escort/protect
    drug plantation
    drug shipment

example:
    coal mine
        accident/death - frequent with slavery
        accident/rescued - no slavery
        strike - no slavery
        acqusition
        new shaft
        financial problems - no slavery
        festival - no slavery
        transport of workforce - slavery
        transport to another site - environment impact
        contract with another site (power plant?) - environment impact
        new resource

    missions:
        change of rules
        find new workers

    worldview
        environmentalism
        slavery

*/