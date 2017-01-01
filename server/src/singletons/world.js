let service = require('./service');
let fs = require('fs');

class World {
	constructor () {
        this.entities = {};
    }

    run () {
        this.loop();
    }

    loop () {
        this.cycle();
        setTimeout(this.loop.bind(this), 1000);
    }

    cycle () {
    }

    load (file) {
        let Entity = require('../classes/entity');
        var saveData = JSON.parse(fs.readFileSync(file, 'utf8'));
        Object.keys(saveData).forEach(type => {
            this.entities[type] = saveData[type].map(data => Entity.loadFromJson(data));
        });
        Entity.updateReferences(this.entities);
    }

    save (file) {
        let saveData = {};
        Object.keys(this.entities).forEach(type => {
            saveData[type] = this.entities[type].map(entity => entity.getSaveData());
        });
        fs.writeFileSync(file, JSON.stringify(saveData), 'utf8');
    }
}

module.exports = new World;
