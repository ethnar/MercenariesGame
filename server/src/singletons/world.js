let service = require('./service');
let fs = require('fs');

let hoursPerDay;
let daysPerWeek;
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

        const perMinute = 2.5;
        const perHour   = 150;
        const perDay    = 60 * 60;
        const perWeek   = 6 * 60 * 60;
        const perMonth  = 24 * 60 * 60;
        this.cycles = [{
            name: 'minutes',
            timer: perMinute,
        }, {
            name: 'hourly',
            timer: perHour,
        }, {
            name: 'daily',
            timer: perDay,
        }, {
            name: 'weekly',
            timer: perWeek,
        }, {
            name: 'monthly',
            timer: perMonth,
        }];

        daysPerWeek = perWeek / perDay;
        hoursPerDay = perDay / perHour;

        this.timeout = this.cycles[0].timer * 1000;
        this.currentGameTime = {
            year: 1945,
            month: 1,
            day: 1,
            hours: 0,
        };
        this.gameSpeed = 200;
    }

    getEntitiesArray (type) {
        return this.entities[type];
    }

    run () {
        this.secondsCount = 0;
        this.loop();
    }

    loop () {
        setTimeout(this.loop.bind(this), Math.floor(this.timeout / this.gameSpeed));
        this.cycle();
    }

    cycle () {
        // initial values included for static code analysis only
        const gameTime = this.currentGameTime;
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

        this.cycleEntities('Country', cycles);
        this.cycleEntities('Site', cycles);
        this.cycleEntities('Politician', cycles);
        this.cycleEntities('Region', cycles);
        this.cycleEntities('Mission', cycles);
        this.cycleEntities('Player', cycles);
        this.cycleEntities('Organisation', cycles);
        if (cycles.hourly) {
            gameTime.hours += 1;
            if (cycles.daily) {
                gameTime.hours = 0;
                gameTime.day += 1;
                if (cycles.monthly) {
                    gameTime.day = 0;
                    gameTime.month += 1;
                    if (gameTime.month > 12) {
                        gameTime.month -= 12;
                        gameTime.year += 1;
                    }
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
        const gameTime = this.currentGameTime;
        const hoursPerWeek = hoursPerDay * daysPerWeek;
        return {
            text: `Week ${Math.floor(gameTime.day / daysPerWeek) + 1}, ${months[gameTime.month]} ${gameTime.year}`,
//            hours: gameTime.hours + gameTime.day * hoursPerDay,
//            hoursThisWeek: (gameTime.hours + gameTime.day * hoursPerDay) % hoursPerWeek,
            tillNextWeek: Math.round(100 * 100 * ((gameTime.hours + gameTime.day * hoursPerDay) % hoursPerWeek) / hoursPerWeek) / 100,
        };
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
