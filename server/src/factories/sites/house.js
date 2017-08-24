const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'House',
        size: misc.random(10) + 4
    }, args));
};
