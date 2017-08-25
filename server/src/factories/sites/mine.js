const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'Mine',
        size: misc.random(10, 25),
        visibility: misc.random(20, 60),
    }, args));
};
