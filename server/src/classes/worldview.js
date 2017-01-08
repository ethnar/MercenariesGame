class Worldview {
    constructor () {
        this.slavery = 0;
        this.environmentalism = 0;
        // -100 - oppressed
        // 100 - dominating
        this.supremacy = {
            black: 0,
            white: 0,
            yellow: 0
        };
        // -100 - oppressed religion
        // 100 - oppressive religion
        this.fanatism = {
            buddhism: 0,
            christianity: 0,
            islam: 0,
            judaism: 0,
            hinduism: 0,
            sikhism: 0
        };
    }
}

module.exports = Worldview;
