let service = require('../singletons/service');
const Entity = require('./entity');
const Site = require('./site');
const Staff = require('./staff');

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

    getOwner () {
        return this.owner;
    }

    getPayload () {
        return {
            id: this.getId(),
            description: this.getDescription(),
            region: this.getRegion().getId(),
            deadline: this.getDeadline(),
            owner: this.getOwner().getId()
        }
    }
}

service.registerHandler('known-missions', (params, player) => {
    if (player) {
        let missions = player.getKnownMissions();
        return Object.keys(missions).map(key => missions[key].getPayload());
    }
    return [];
});

service.registerHandler('current-missions', (params, player) => {
    if (player) {
        let missions = player.getCurrentMissions();
        return Object.keys(missions).map(key => missions[key].getPayload());
    }
    return [];
});

service.registerHandler('startMission', (params, player) => {
    const site = Site.getById(params.site);
    const mission = Mission.getById(params.mission);
    const staffList = params.staffList.map(staffId => Staff.getById(staffId));

    if (player && mission && site && staffList.length && site.getOwner() === player) {
        if (!player.isMissionKnown(mission)) {
            return { message: 'Sending staff to an unknown mission' }
        }
        staffList.forEach(staff => {
            if (staff.getSite() !== site) {
                return { message: 'Sending staff from wrong site' }
            }
        });
        return { result: true };
    }
    return { message: 'Invalid request' };
});

Entity.registerClass(Mission);
module.exports = Mission;
