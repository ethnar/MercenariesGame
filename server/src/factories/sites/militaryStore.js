const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'Military Store',
        size: misc.random(4, 14),
        visibility: misc.random(2, 30),
    }, args));
};
