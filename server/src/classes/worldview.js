const misc = require('../singletons/misc');

class Worldview {
    constructor (derivativeWorldview = {}) {
        Object.keys(Worldview.TYPE).forEach(dimension => {
            this[dimension] = derivativeWorldview[dimension] || 0;
        });
    }

    get (section) {
        return this[section];
    }
}

Worldview.TYPE = {
    SLAVERY: 0,
    ENVIRONMENTALISM: 1,
    DRUG_USE: 2,
    CHILD_ABUSE: 3
};

module.exports = Worldview;
