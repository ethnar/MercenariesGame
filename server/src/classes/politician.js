const Entity = require('./entity');
const Human = require('./human');
const Mission = require('./mission.js');
const misc = require('../singletons/misc');
let world = require('../singletons/world');
const Fact = require('./fact');

class Politician extends Human {
    constructor (args) {
        super(args);

        args = args || {};

        this.country = args.country;
        this.missions = [];
    }

    cycle (cycles) {
        if (cycles.regular && misc.chances(100 - 25 * this.missions.length)) { //4 missions cap per politician
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
    }

    withdrawMission (mission) {
        const idx = this.missions.findIndex(m => m === mission);
        mission.setWithdrawn(true);
        world.getEntitiesArray('Player').forEach(player => {
            if (player.isMissionKnown(mission)) {
                player.forgetMission(mission);
            }
        });
    }
}

Entity.registerClass(Politician);
module.exports = Politician;
