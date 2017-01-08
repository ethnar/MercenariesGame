const Entity = require('./entity');

class Fact extends Entity {
    constructor () {
        super();
    }
}

Entity.registerClass(Fact);
module.exports = Fact;
