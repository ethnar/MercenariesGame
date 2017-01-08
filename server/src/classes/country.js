const Worldview = require('./worldview');
const Entity = require('./entity');
const Fact = require('./fact');
const Mercenary = require('./mercenary');
const world = require('../singletons/world');

class Country extends Entity {
    constructor (name) {
        super();
        this.name = name;
        this.worldview = new Worldview();
        this.ruler = null;
        this.armyLeader = null;
        this.missions = [];
        this.eventsQueue = [];
        this.politicians = [];
    }

    cycle () {
        if (!this.processQueue())
        {
            this.generateEvents();
        }
    }

    processQueue () {
        let result = false;
        while (this.eventsQueue.length && !result) {
            let event = this.eventsQueue.shift();
            result = this[event]();
        }
        return result;
    }

    generateEvents () {
        switch (true) {
            case !this.ruler && this.politicians.length && this.chances(50 + this.politicians.length * 10):
                new Fact(95, '%s is preparing elections', this);
                this.queueEvent(this.elections);
                break;
            case this.chances(100 - this.politicians.length * 5):
                this.newPolitician();
                break;
        }
    }

    queueEvent (callback) {
        this.eventsQueue.push(callback.name);
    }

    chances (percentage) {
        return Math.random() * 100 < percentage;
    }

    /** events **/
    elections () {
        if (!this.politicians.length) {
            return false;
        }
        this.ruler = this.politicians.pop();
        new Fact(98, '%s was elected leader of %s', this.ruler, this);
        return true;
    }

    newPolitician () {
        const newGuy = new Mercenary();
        this.politicians.push(newGuy);
        new Fact(30, '%s joins the political scene of %s', newGuy, this);
    }
}

Entity.registerClass(Country);
module.exports = Country;
