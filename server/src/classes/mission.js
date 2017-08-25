let service = require('../singletons/service');
const world = require('../singletons/world');
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
        this.withdrawn = false;
        this.duration = args.duration || 15000;
        this.assignee = null;
        this.contractedStaff = [];
        this.finished = false;
        this.payout = args.payout || 500;
        this.reserved = false;

        if (this.region) {
            this.region.addMission(this);
        }
    }

    cycle () {
        if (!this.finished && new Date().getTime() >= this.startTime + this.duration) {
            this.finish();
        }
    }

    isReservedBy (player) {
        return this.assignee === player && this.reserved === true;
    }

    getAssignee () {
        return this.assignee;
    }

    reserve (player) {
        this.assignee = player;
        this.reserved = true;
        this.updated();
    }

    freeReservation () {
        this.assignee = null;
        this.reserved = false;
        this.updated();
    }

    setWithdrawn () {
        this.withdrawn = true;
    }

    isWithdrawn () {
        return this.withdrawn;
    }

    start (player, site, staffList) {
        this.getOwner().withdrawMission(this);
        this.assignee = player;
        player.startedMission(this);
        staffList.forEach(staff => staff.goOnMission(this));
        this.contractedStaff = staffList;
        this.startTime = new Date().getTime();
    }

    finish () {
        this.finished = true;
        this.assignee.finishedMission(this);
        this.assignee.addFunds(this.payout);
        this.contractedStaff.forEach(staff => staff.returnFromMission());
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

    getPayload (player) {
        return {
            id: this.getId(),
            description: this.getDescription(),
            region: this.getRegion().getId(),
            deadline: this.getDeadline(),
            owner: this.getOwner().getId(),
            assignee: this.getAssignee() ? this.getAssignee().getId() : null,
        }
    }
}

service.registerHandler('reserve-mission', (params, player) => {
    const mission = Mission.getById(params.mission);
    if (!player || !mission) {
        return errorResponse('Invalid request');
    }

    const lastReservation = world
        .getEntitiesArray('Mission')
        .find(mission => (mission.isReservedBy(player)));
    if (lastReservation) {
        lastReservation.freeReservation();
    }

    const currentAssignee = mission.getAssignee();

    if (currentAssignee && currentAssignee !== player) {
        return errorResponse('Trying to reserve mission owned by someone else');
    }

    mission.reserve(player);

    return { result: true };
});

service.registerHandler('start-mission', (params, player) => {
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
    if (staffList.find(staff => staff.getSite() !== site)) {
        return errorResponse('Sending staff from wrong site');
    }

    mission.start(player, site, staffList);

    return { result: true };
});

Entity.registerClass(Mission);
module.exports = Mission;
