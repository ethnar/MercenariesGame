const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'Office',
        size: misc.random(10, 14),
        visibility: misc.random(40, 100),
        purchasable: true,
        organisable: true,
    }, args));
};
