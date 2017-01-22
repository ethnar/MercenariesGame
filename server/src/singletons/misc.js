module.exports = {
    chances (percentage) {
        return Math.random() * 100 < percentage;
    },

    randomEntity (array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};
