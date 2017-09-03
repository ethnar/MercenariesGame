const Entity = require('./entity');
const service = require('../singletons/service');
const errorResponse = require('../functions/error-response');

class Item extends Entity {
    constructor (args) {
        super(args);

        this.slot = args.slot;
    }
}
