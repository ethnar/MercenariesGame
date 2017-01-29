const misc = require('../singletons/misc');

class Worldview {
    constructor () {
        this.slavery = 0;
        this.environmentalism = 0;
        this.drugUse = 0;
        // // 100 - dominating
        // this.supremacy = {
        //     black: 0,
        //     white: 0,
        //     yellow: 0
        // };
        // // 100 - oppressive religion
        // this.fanaticism = {
        //     buddhism: 0,
        //     christianity: 0,
        //     islam: 0,
        //     judaism: 0,
        //     hinduism: 0,
        //     sikhism: 0
        // };
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

    worldview
        environmentalism
        slavery

*/