const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    const size = misc.random(40, 80);
    return new Site(Object.assign({
        name: 'Airfield',
        size: misc.random(40, 80),
        visibility: size + misc.random(-20, 20),
    }, args));
};
