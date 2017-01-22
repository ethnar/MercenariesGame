let service = require('./service');
let fs = require('fs');

class World {
    constructor () {
        this.entities = {};
    }

    getEntitiesArray (type) {
        return this.entities[type];
    }

    run () {
        this.loop();
    }

    loop () {
        this.cycle();
        setTimeout(this.loop.bind(this), 2000);
    }

    cycle () {
        console.log('- new cycle -');
        this.cycleEntities('Country');
        this.cycleEntities('Player');
        this.cycleEntities('Politician');
        this.save('./rolling-save.json');
    }

    cycleEntities (type) {
        this.getEntitiesArray(type).forEach(entity => {
            entity.cycle();
        });
    }

    load (file) {
        let Entity = require('../classes/entity');
        let saveData = JSON.parse(fs.readFileSync(file, 'utf8'));
        Object.keys(saveData).forEach(type => {
            this.entities[type] = saveData[type].map(data => Entity.loadFromJson(data));
        });
        Entity.recursiveDecodeEntities(this.entities);
        // TODO: reconnect all the players?
    }

    save (file) {
        let saveData = {};
        Object.keys(this.entities).forEach(type => {
            saveData[type] = this.getEntitiesArray(type).map(entity => entity.getSaveData());
        });
        fs.writeFileSync(file, JSON.stringify(saveData), 'utf8');
    }
}

module.exports = new World;
