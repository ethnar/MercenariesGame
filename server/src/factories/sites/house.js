const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'House',
        size: misc.random(4, 6),
        visibility: misc.random(40, 100),
        purchasable: true,
    }, args));
};
