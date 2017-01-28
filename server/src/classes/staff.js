const Entity = require('./entity');
const Human = require('./human');
const Site = require('./site');
const service = require('../singletons/service');
const errorResponse = require('../functions/error-response');

class Staff extends Human {
    constructor (args) {
        super(args);
        this.strength = 5;
    }

    setSite (site) {
        this.site = site;
        service.sendUpdate('staff', site.getOwner(), this.getPayload());
    }

    getSite () {
        return this.site;
    }

    getHireCost () {
        return this.strength + 1000;
    }

    getPayload () {
        return {
            id: this.id,
            name: this.name,
            site: this.site ? this.site.getId() : null,
            cost: this.getHireCost()
        }
    }
}

service.registerHandler('staff', (params, player) => {
    if (player)
    {
        let staff = player.getStaff();
        return staff.map(personnel => personnel.getPayload());
    }
    return [];
});

service.registerHandler('recruit', (params, player) => {
    const site = Site.getById(params.site);
    const recruit = Staff.getById(params.staff);

    if (!player || !site || !recruit) {
        return errorResponse('Invalid request');
    }
    if (site.getOwner() !== player) {
        return errorResponse('Managing non-owned site');
    }
    if (!player.pay(recruit.getHireCost())) {
        return errorResponse('Not enough funds');
    }

    site.getRegion().withdrawRecruit(recruit);
    site.addStaff(recruit);

    return { result: true };
});

Entity.registerClass(Staff);
module.exports = Staff;
