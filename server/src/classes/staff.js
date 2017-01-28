const Entity = require('./entity');
const Human = require('./human');
const Site = require('./site');
const service = require('../singletons/service');

class Staff extends Human {
    constructor (args) {
        super(args);
        this.strength = 5;
    }

    setSite (site) {
        this.site = site;
        service.sendUpdate('staff', site.getOwner(), this.getPayload());
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

    if (player && site && recruit && site.getOwner() === player) {
        if (player.pay(recruit.getHireCost()))
        {
            site.getRegion().withdrawRecruit(recruit);
            site.addStaff(recruit);
            return true;
        }
        return 'Not enough funds';
    }
    return 'Invalid request';
});

Entity.registerClass(Staff);
module.exports = Staff;
