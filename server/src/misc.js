module.exports = {
    chances (percentage) {
        return Math.random() * 100 < percentage;
    }
};
