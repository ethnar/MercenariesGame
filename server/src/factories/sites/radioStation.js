const Site = require('../../classes/site');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Site(Object.assign({
        name: 'Radio Station',
        size: misc.random(4, 5),
        visibility: misc.random(70, 100),
        organisable: true,
    }, args));
};
