const world = require('./singletons/world');
let service = require('./singletons/service');
let Player = require('./classes/player');
let Country = require('./classes/country');
let Region = require('./classes/region');
let Staff = require('./classes/staff');
let Fact = require('./classes/fact');
let Site = require('./classes/site');
let Mission = require('./classes/mission');
let Equipment = require('./classes/equipment/equipment');
let Worldview = require('./classes/worldview');
let Organisation = require('./classes/organisation');
let SiteFactory = require('./factories/sites/.index');
let misc = require('./singletons/misc');

global.STATICS = {};
require('./statics');

let canada = new Country('Canada');
canada.setNameGenerator('canada');
let india = new Country('India');
india.setNameGenerator('canada');
let poland = new Country('Poland');
poland.setNameGenerator('canada');
let russia = new Country('Russia');
russia.setNameGenerator('canada');
let uk = new Country('United Kingdom');
uk.setNameGenerator('canada');

let organisations = {};

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

let toronto = new Region('Toronto', canada);
let quebec = new Region('Quebec City', canada);
regions = [...regions, toronto, quebec];

let canadianSenate = new Site({ name: 'Senate', region: quebec });
canadianSenate.setSize(50);


let dheli = new Region('Dheli', india);
let kolkata = new Region('Kolkata', india);
regions = [...regions, dheli, kolkata];

let indianSenate = new Site({ name: 'Senate', region: dheli });
indianSenate.setSize(50);


let warsaw = new Region('Warsaw', poland);
let krakow = new Region('Krakow', poland);
regions = [...regions, warsaw, krakow];

let polishSenate = new Site({ name: 'Senate', region: warsaw });
polishSenate.setSize(50);


let moscow = new Region('Moscow', russia);
let stpetersburg = new Region('Saint Petersburg', russia);
regions = [...regions, stpetersburg, moscow];

let russianSenate = new Site({ name: 'Senate', region: moscow });
russianSenate.setSize(50);


let london = new Region('London', uk);
let cardiff = new Region('Cardiff', uk);
regions = [...regions, london, cardiff];

let ukSenate = new Site({ name: 'Senate', region: london });
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
let test = new Player('test', 'test');

let hq = new Site({ name: 'Office', region: toronto });
hq.setOwner(test);

test.addFunds(10000);

hq.addStaff(new Staff({region: toronto}));
hq.addStaff(new Staff({region: toronto}));


process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
