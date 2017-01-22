let service = require('../singletons/service');
const Entity = require('./entity');

class Mission extends Entity {
    constructor (args) {
        super();

        args = args || {};

        this.owner = args.owner;
        this.deadline = args.deadline;
        this.payment = args.payment;
        this.description = args.description;
        this.region = args.region;
        this.discoverability = args.discoverability;

        if (this.region) {
            this.region.addMission(this);
        }
    }

    isInvalid () {
    }

    getDiscoverability(){
        return this.discoverability;
    }

    getDescription(){
        return this.description;
    }

    getRegion(){
        return this.region;
    }

    getDeadline(){
        return this.deadline;
    }

    getPayload () {
        return {
            id: this.getId(),
            description: this.getDescription(),
            region: this.getRegion().getId(),
            deadline: this.getDeadline()
        }
    }
}

service.registerHandler('known-missions', (params, player) => {
    if (player) {
        let missions = player.getKnownMissions();
        return Object.keys(missions).map(key => missions[key].id);
    }
    return [];
});

service.registerHandler('current-missions', (params, player) => {
    if (player) {
        let missions = player.getCurrentMissions();
        return Object.keys(missions).map(key => missions[key].id);
    }
    return [];
});

Entity.registerClass(Mission);
module.exports = Mission;
