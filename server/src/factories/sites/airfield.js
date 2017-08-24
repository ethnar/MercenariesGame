const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'Airfield',
        size: misc.random(20) + 60
    }, args));
};
