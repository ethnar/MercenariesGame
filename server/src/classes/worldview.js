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

    static generateRandom() {
        const template = {};
        Object.keys(Worldview.TYPE).forEach(dimension => {
            template[dimension] = misc.random(-1, 1);
        });
        return new Worldview(template);
    }

    getAlignScore(worldview) {
        let score = false;
        Object.keys(Worldview.TYPE).forEach(dimension => {
            if (worldview.get(dimension) !== 0 &&
                worldview.get(dimension) === this.get(dimension)) {
                score = score + 1;
            }
            if (worldview.get(dimension) !== 0 &&
                worldview.get(dimension) === -this.get(dimension)) {
                score = score - 1;
            }
        });
        return score;
    }

    isConflicting(worldview) {
        return this.getAlignScore(worldview) < 0;
    }

    isAligning(worldview) {
        return this.getAlignScore(worldview) > 0;
    }
}

Worldview.TYPE = {
    SLAVERY: 0,
    ENVIRONMENTALISM: 1,
    DRUG_USE: 2,
    CHILD_ABUSE: 3
};

module.exports = Worldview;
