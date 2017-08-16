module.exports = {
    chances (percentage) {
        return Math.random() * 100 < percentage;
    },

    gaussian (total, midpoint) {
        midpoint = (midpoint !== undefined ? midpoint : total / 2);
        const resolution = 4;
        let gauss = 0;
        for (let i = 0; i < resolution; i++) {
            gauss += Math.random();
        }
        gauss = gauss / resolution * 2;
        let result;
        if (gauss < 1) {
            result = gauss * midpoint;
        } else {
            result = (gauss - 1) * (total - midpoint) + midpoint;
        }
        return result;
    },

    randomEntity (array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    toArray (object) {
        return Object.keys(object).map(key => object[key]);
    },

    getIntelCost(type, current) {
        if (current === 10) {
            return null;
        }
        let base;
        let multiplier;
        switch (type) {
            case 'region':
                base = 2;
                multiplier = 10;
                break;
            case 'site':
                base = 1.5;
                multiplier = 5;
                break;
            case 'politician':
                base = 3;
                multiplier = 20;
                break;
        }
        return Math.ceil(Math.pow(base, current + 1) * multiplier);
    }
};
