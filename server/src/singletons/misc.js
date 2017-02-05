const self = {
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

    randomEntity (collection) {
        if(Array.isArray(collection)){
            return collection[Math.floor(Math.random() * collection.length)];
        } else {
            return collection[self.randomEntity(Object.keys(collection))];
        }
    }
};

module.exports = self;