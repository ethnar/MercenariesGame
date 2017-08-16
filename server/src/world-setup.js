let world = require('./singletons/world');
let service = require('./singletons/service');
let Player = require('./classes/player');
let Country = require('./classes/country');
let Region = require('./classes/region');
let Staff = require('./classes/staff');
let Fact = require('./classes/fact');
let Site = require('./classes/site');
let Cell = require('./classes/sites/cell');
let Mission = require('./classes/mission');
let Equipment = require('./classes/equipment/equipment');
let Worldview = require('./classes/worldview');


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

let test = new Player('test', 'test');

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


let hq = new Cell({ name: 'HQ', region: toronto });
hq.setOwner(test);

let secondary = new Cell({ name: 'FOB', region: quebec });
secondary.setOwner(test);

test.addFunds(10000);

hq.addStaff(new Staff({region: toronto}));
hq.addStaff(new Staff({region: toronto}));
hq.addStaff(new Staff({region: toronto}));
hq.addStaff(new Staff({region: toronto}));
secondary.addStaff(new Staff({region: toronto}));
secondary.addStaff(new Staff({region: toronto}));
secondary.addStaff(new Staff({region: toronto}));

regions.forEach(region => {
    const count = Math.ceil(Math.random() * 5 + 30);
    for (let i = 0; i < count; i++) {
        const site = new Site({name: 'House', region: region});
    }
});

/****** STARTUP *******/

world.save('./template-save.json');


service.init();
world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
