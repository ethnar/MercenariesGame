let service = require('./service');
let fs = require('fs');

class World {
    constructor () {
        this.entities = {};

        // timers in seconds
        // 1 month = 1 day
        // 1 week = 6 hours
        // 1 day = 51.5 mins
        // 1 hour = 128.75 secs
        // 1 minute = 2 secs

        // simplified (6 days week)
        // 1 month = 1 day
        // 1 week = 6 hours
        // 1 day = 60 mins
        // 1 hour = 150 secs
        // 1 minute = 2.5 secs

        this.cycles = [{
            name: 'minutes',
            timer: 2.5,
        }, {
            name: 'hourly',
            timer: 150,
        }, {
            name: 'daily',
            timer: 60 * 60,
        }, {
            name: 'weekly',
            timer: 6 * 60 * 60,
        }, {
            name: 'monthly',
            timer: 24 * 60 * 60,
        }];
        this.timeout = this.cycles[0].timer * 1000;
        this.currentGameTime = {
            year: 1945,
            month: 1,
            day: 1,
        };
        this.gameSpeed = 10;
    }

    getEntitiesArray (type) {
        return this.entities[type];
    }

    run () {
        this.secondsCount = this.timeout;
        this.loop();
    }

    loop () {
        setTimeout(this.loop.bind(this), Math.floor(this.timeout / this.gameSpeed));
        this.cycle();
    }

    cycle () {
        // initial values included for static code analysis only
        const cycles = {
            minutes: false,
            hourly: false,
            daily: false,
            weekly: false,
            monthly: false,
        };
        this.cycles.forEach(cycle => {
            cycles[cycle.name] = (this.secondsCount % cycle.timer === 0);
        });
        this.secondsCount += this.timeout / 1000;
//        console.log('---------------------------------------- new cycle ----------------------------------------');
        this.cycleEntities('Country', cycles);
        this.cycleEntities('Site', cycles);
        this.cycleEntities('Politician', cycles);
        this.cycleEntities('Region', cycles);
        this.cycleEntities('Mission', cycles);
        this.cycleEntities('Player', cycles);
        this.cycleEntities('Organisation', cycles);
        if (cycles.daily) {
            this.currentGameTime.day += 1;
            if (this.currentGameTime.day > 7 * 4) {
                this.currentGameTime.day -= 7 * 4;
                this.currentGameTime.month += 1;
                if (this.currentGameTime.month > 12) {
                    this.currentGameTime.month -= 12;
                    this.currentGameTime.year += 1;
                }
            }
            service.sendUpdateToAll('date', this.getCurrentDate());
        }
        this.save('./rolling-save.json');
    }

    cycleEntities (type, cycles) {
        this.getEntitiesArray(type).forEach(entity => {
            entity.cycle(cycles);
        });
    }

    getCurrentDate() {
        const date = this.currentGameTime;
        const months = {
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec',
        };
        return `Week ${Math.floor((date.day - 1) / 7) + 1}, ${months[date.month]} ${date.year}`;
    }

    load (file) {
        let Entity = require('../classes/entity');
        let saveData = JSON.parse(fs.readFileSync(file, 'utf8'));
        Object.keys(saveData).forEach(type => {
            this.entities[type] = saveData[type].map(data => Entity.loadFromJson(data));
        });
        Entity.recursiveDecodeEntities(this.entities);
    }

    save (file) {
        let saveData = {};
        Object.keys(this.entities).forEach(type => {
            saveData[type] = this.getEntitiesArray(type).map(entity => entity.getSaveData());
        });
        fs.writeFileSync(file, JSON.stringify(saveData), 'utf8');
    }
}

const world = new World;
module.exports = world;

service.registerHandler('date', (params, player) => {
    return world.getCurrentDate();
});
