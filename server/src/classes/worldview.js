const misc = require('../singletons/misc');

class Worldview {
    constructor (derivativeWorldview = {}) {
        Object.values(STATICS.WORLDVIEW.TYPES).forEach(dimension => {
            this[dimension] = derivativeWorldview[dimension] || 0;
        });
    }

    get (section) {
        return this[section];
    }

    static generateRandom() {
        const template = {};
        Object.values(STATICS.WORLDVIEW.TYPES).forEach(dimension => {
            template[dimension] = misc.random(-1, 1);
        });
        return new Worldview(template);
    }

    getAlignScore(worldview) {
        let score = false;
        Object.values(STATICS.WORLDVIEW.TYPES).forEach(dimension => {
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

    getPayload () {
        return this;
    }
}

module.exports = Worldview;
