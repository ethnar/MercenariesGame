const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'General Store',
        size: misc.random(4, 12),
        visibility: misc.random(70, 95),
        wareTypes: [Site.OFFERS.GENERAL],
    }, args));
};
