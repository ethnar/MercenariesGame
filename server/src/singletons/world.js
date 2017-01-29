let service = require('./service');
let fs = require('fs');

class World {
    constructor () {
        this.entities = {};

        // timers in seconds
        this.cycles = [{
            name: 'frequent',
            timer: 1 // 10
        }, {
            name: 'regular',
            timer: 6 // 60
        }, {
            name: 'rare',
            timer: 60 // 600
        }];
        this.timeout = 1000;
    }

    getEntitiesArray (type) {
        return this.entities[type];
    }

    run () {
        this.loop();
        this.secondsCount = 0;
    }

    loop () {
        this.cycle();
        setTimeout(this.loop.bind(this), this.timeout);
    }

    cycle () {
        // initial values included for static code analysis only
        const cycles = {
            frequent: false,
            regular: false,
            rare: false
        };
        this.cycles.forEach(cycle => {
            cycles[cycle.name] = (this.secondsCount % cycle.timer === 0);
        });
        this.secondsCount += this.timeout / 1000;
        console.log('');
        console.log('---------------------------------------- new cycle ----------------------------------------');
        this.cycleEntities('Country', cycles);
        this.cycleEntities('Site', cycles);
        this.cycleEntities('Politician', cycles);
        this.cycleEntities('Region', cycles);
        this.cycleEntities('Mission', cycles);
        this.save('./rolling-save.json');
    }

    cycleEntities (type, cycles) {
        this.getEntitiesArray(type).forEach(entity => {
            entity.cycle(cycles);
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
