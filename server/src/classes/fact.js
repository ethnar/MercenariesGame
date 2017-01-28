const util = require('util');
const service = require('../singletons/service');

const Entity = require('./entity');

class Fact extends Entity {
    constructor (discoverability, message, ...args) {
        super();
        this.discoverability = discoverability;
        this.message = message;
        this.references = args;

        if (message) {
            console.log(this.getFormatted());
        }
        this.references.forEach(object => {
            object.relatedFacts.push(this);
        });
    }

    getFormatted () {
        const args = this.references.map(object => object.getLabelPayload());
        args.unshift(this.message);
        return util.format.apply(util, args);
    }

    getDiscoverability () {
        return this.discoverability;
    }
}

service.registerHandler('news', (params, player) => {
    if (player)
    {
        let facts = player.getKnownFacts();
        return Object.keys(facts).map(key => facts[key].getFormatted());
    }
    return [];
});

Entity.registerClass(Fact);
module.exports = Fact;
