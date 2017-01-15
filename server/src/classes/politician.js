const Entity = require('./entity');
const Human = require('./human');
const Mission = require('./mission.js');
const misc = require('../misc');
let world = require('../singletons/world');
const Fact = require('./fact');

class Politician extends Human {
    constructor (args) {
        super();

        args = args || {};

        this.country = args.country;
        this.missions = [];
    }

    cycle () {
        if (misc.chances(100 - 25 * this.missions.length)) { //4 missions cap per politician
            this.generateMission();
        }
    }

    generateMission () {
        let startingRegion = misc.randomEntity(this.country.regions);
        let targetRegion = misc.randomEntity(world.entities.Region);
        let message = 'Save the world!';
        let newMission = new Mission({
            owner: this,
            message: message,
            startingRegion: startingRegion,
            targetRegion: targetRegion,
            deadline: Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24) //within 24h
        });
        this.missions.push(newMission);
        new Fact(10,'%s has a new mission starting in %s: '+message,this,startingRegion);
    }
}

Entity.registerClass(Politician);
module.exports = Politician;
