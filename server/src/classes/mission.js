let service = require('../singletons/service');
const Entity = require('./entity');
const Site = require('./site');
const Staff = require('./staff');
const errorResponse = require('../functions/error-response');

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
        this.withdrawn = false;
        this.duration = args.duration || 15000;
        this.contractedPlayer = null;
        this.contractedStaff = [];
        this.finished = false;
        this.payout = args.payout || 500;

        if (this.region) {
            this.region.addMission(this);
        }
    }

    cycle () {
        if (!this.finished && new Date().getTime() >= this.startTime + this.duration) {
            this.finish();
        }
    }

    setWithdrawn () {
        this.withdrawn = true;
    }

    isWithdrawn () {
        return this.withdrawn;
    }

    start (player, site, staffList) {
        this.getOwner().withdrawMission(this);
        this.contractedPlayer = player;
        player.startedMission(this);
        staffList.forEach(staff => staff.goOnMission(this));
        this.contractedStaff = staffList;
        this.startTime = new Date().getTime();
    }

    finish () {
        this.finished = true;
        this.contractedPlayer.finishedMission(this);
        this.contractedPlayer.addFunds(this.payout);
        this.contractedStaff.forEach(staff => staff.returnFromMission());
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

    getContractedPlayer(){
        return this.contractedPlayer();
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

    if (!player || !mission || !site || !staffList || !staffList.length) {
        return errorResponse('Invalid request');
    }
    if (site.getOwner() !== player) {
        return errorResponse('Managing non-owned site');
    }
    if (staffList.find(staff => staff.getMission())) {
        return errorResponse('Sending staff that\'s currently on mission');
    }
    if (!player.isMissionKnown(mission)) {
        return errorResponse('Sending staff to an unknown mission');
    }
    if (staffList.find(staff => staff.getSite() !== site)) {
        return errorResponse('Sending staff from wrong site');
    }

    mission.start(player, site, staffList);

    return { result: true };
});

Entity.registerClass(Mission);
module.exports = Mission;
