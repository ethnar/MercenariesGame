const Entity = require('./entity');
const Human = require('./human');
const Mission = require('./mission.js');
const misc = require('../singletons/misc');
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
        let region = misc.randomEntity(this.country.regions);
        let description = misc.chances(50) ? 'Save the world!' : 'Destroy everything!';
        let newMission = new Mission({
            owner: this,
            description: description,
            region: region,
            deadline: Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24), //within 24h
            discoverability: Math.floor(Math.random() * 100)
        });
        this.missions.push(newMission);
        //console.log('New mission - ' + newMission.id + ': '+newMission.description + '. Chances of discovery: ' + newMission.discoverability + '%');
        //new Fact(10,'%s has a new mission starting in %s: ' + message, this, startingRegion);
    }
}

Entity.registerClass(Politician);
module.exports = Politician;
