const Entity = require('./entity');
const service = require('../singletons/service');
const errorResponse = require('../functions/error-response');

class Item extends Entity {
    constructor (args) {
        super(args);

        this.name = args.name;
        this.slot = args.slot;
        this.price = args.price;
        this.weapon = args.weapon;
    }

    getName () {
        return this.name;
    }

    getPrice () {
        return this.price;
    }

    getSlot () {
        return this.slot;
    }

    getPayload () {
        return {
            id: this.getId(),
            name: this.getName(),
            price: this.getPrice(),
            slot: this.getSlot(),
            weapon: this.weapon,
        }
    }
}

Entity.registerClass(Item);
module.exports = Item;
