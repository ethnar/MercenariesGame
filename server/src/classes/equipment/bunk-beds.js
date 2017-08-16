const Entity = require('../entity');
const Equipment = require('./equipment');

class BunkBeds extends Equipment {
    constructor (args) {
        args = Object.assign({}, args);
        args.className = 'Equipment';
        super(args);

        this.name = 'Bunk beds';

        this.price = 100;
        this.space = 4;
    }

    install (site) {
        if (Equipment.prototype.install.call(this, site)) {
           // site.addLivingSpace(2);
        }
    }

    uninstall (site) {
        if (Equipment.prototype.install.call(this, site)) {
            // if (!site.removeLivingSpace(2)) {
            //
            // }
        }
    }
}

Entity.registerClass(BunkBeds);
module.exports = BunkBeds;
