const Item = require('../../classes/item');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Item(Object.assign({
        name: 'Pistol',
        price: 300,
        slot: STATICS.ITEMS.SLOTS.WEAPON,
        weapon: {
            type: STATICS.ITEMS.WEAPON_TYPES.PISTOL,
            power: 4,
        }
    }, args));
};
