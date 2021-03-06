const Item = require('../../classes/item');
const misc = require('../../singletons/misc');

module.exports = (args) => {
    return new Item(Object.assign({
        name: 'Knife',
        price: 50,
        slot: STATICS.ITEMS.SLOTS.WEAPON,
        weapon: {
            type: STATICS.ITEMS.WEAPON_TYPES.MELEE,
            power: 3,
        },
    }, args));
};
