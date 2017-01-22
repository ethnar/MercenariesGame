const Entity = require('./entity');
const Human = require('./human');
const service = require('../singletons/service');

class Staff extends Human {
    constructor () {
        super();
    }

    setSite (site) {
        this.site = site;
    }

    getPayload () {
        return {
            id: this.id,
            name: this.name,
            site: this.site.getId()
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

Entity.registerClass(Staff);
module.exports = Staff;
