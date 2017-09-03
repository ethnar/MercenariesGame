global.STATICS = {};
require('./statics');

const world = require('./singletons/world');
const service = require('./singletons/service');
const Player = require('./classes/player');
const Country = require('./classes/country');
const Region = require('./classes/region');
const Staff = require('./classes/staff');
const Site = require('./classes/site');
//const Mission = require('./classes/mission');
//const Equipment = require('./classes/equipment/equipment');
//const Worldview = require('./classes/worldview');
const Organisation = require('./classes/organisation');
const SiteFactory = require('./factories/sites/.index');
const misc = require('./singletons/misc');


const canada = new Country('Canada');
canada.setNameGenerator('canada');
const india = new Country('India');
india.setNameGenerator('canada');
const poland = new Country('Poland');
poland.setNameGenerator('canada');
const russia = new Country('Russia');
russia.setNameGenerator('canada');
const uk = new Country('United Kingdom');
uk.setNameGenerator('canada');

const organisations = {};

Object.keys(STATICS.WORLDVIEW.TYPES).forEach(dimension => {
    organisations['+' + dimension] = new Organisation({
        name: 'Defenders of ' + dimension,
        worldview: {
            [STATICS.WORLDVIEW.TYPES[dimension]]: 1
        }
    });
    organisations['-' + dimension] = new Organisation({
        name: 'Oppressors of ' + dimension,
        worldview: {
            [STATICS.WORLDVIEW.TYPES[dimension]]: -1
        }
    });
});

let regions = [];

const toronto = new Region('Toronto', canada);
const quebec = new Region('Quebec City', canada);
regions = [...regions, toronto, quebec];

const canadianSenate = new Site({ name: 'Senate', region: quebec });
canadianSenate.setSize(50);


const dheli = new Region('Dheli', india);
const kolkata = new Region('Kolkata', india);
regions = [...regions, dheli, kolkata];

const indianSenate = new Site({ name: 'Senate', region: dheli });
indianSenate.setSize(50);


const warsaw = new Region('Warsaw', poland);
const krakow = new Region('Krakow', poland);
regions = [...regions, warsaw, krakow];

const polishSenate = new Site({ name: 'Senate', region: warsaw });
polishSenate.setSize(50);


const moscow = new Region('Moscow', russia);
const stpetersburg = new Region('Saint Petersburg', russia);
regions = [...regions, stpetersburg, moscow];

const russianSenate = new Site({ name: 'Senate', region: moscow });
russianSenate.setSize(50);


const london = new Region('London', uk);
const cardiff = new Region('Cardiff', uk);
regions = [...regions, london, cardiff];

const ukSenate = new Site({ name: 'Senate', region: london });
ukSenate.setSize(50);

regions.forEach(region => {
    const counts = {
        office: misc.random(10, 20),
        airfield: misc.random(0, 2),
        militaryStore: misc.random(1, 3),
        generalStore: misc.random(2, 5),
        recruitmentCentre: misc.random(2, 4),
        mine: misc.random(0, 1),
        radioStation: misc.random(3, 5),
        house: misc.random(6, 10),
    };
    Object.keys(counts).forEach(type => {
        const count = counts[type];
        for (let i = 0; i < count; i++) {
            const site = SiteFactory[type]({region: region});
        }
    });
});

/****** STARTUP *******/

world.save('./template-save.json');


service.init();
world.run();

for (let i = 0; i < 100000; i++) {
    world.cycle();
}

// set up test player
const test = new Player('test', 'test');

const hq = new Site({ name: 'Office', region: toronto });
hq.setOwner(test);

test.addFunds(10000);

hq.addStaff(new Staff({region: toronto}));
hq.addStaff(new Staff({region: toronto}));


process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
