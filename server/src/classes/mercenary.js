const Entity = require('./entity');
const Human = require('./human');

class Mercenary extends Human {
    constructor () {
        super();
    }
}

Entity.registerClass(Mercenary);
module.exports = Mercenary;
