const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'Recruitment Centre',
        size: misc.random(4, 6),
        visibility: misc.random(50, 95),
        wareTypes: [Site.OFFERS.PERSONNEL],
    }, args));
};
