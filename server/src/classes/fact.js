const util = require('util');

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
    }

    getFormatted () {
        this.references.forEach(object => {
            object.relatedFacts.push(this);
        });
        const args = this.references.map(object => {
            return '{' + object.className + ':' + object.id + '}';
        });
        args.unshift(this.message);
        return util.format.apply(util, args);
    }
}

Entity.registerClass(Fact);
module.exports = Fact;
