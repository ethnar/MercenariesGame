const Entity = require('./entity');
const Human = require('./human');

class Politician extends Human {
    constructor () {
        super();
    }

    cycle () {
        
    }
}

Entity.registerClass(Politician);
module.exports = Politician;
