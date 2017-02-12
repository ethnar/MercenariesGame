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

let toronto = new Region('Toronto', canada);
let quebec = new Region('Quebec City', canada);

let canadianSenate = new Site({ name: 'Senate', region: quebec });
canadianSenate.setStandard(100);
canadianSenate.setSize(50);


let dheli = new Region('Dheli', india);
let kolkata = new Region('Kolkata', india);

let indianSenate = new Site({ name: 'Senate', region: dheli });
indianSenate.setStandard(100);
indianSenate.setSize(50);


let warsaw = new Region('Warsaw', poland);
let krakow = new Region('Krakow', poland);

let polishSenate = new Site({ name: 'Senate', region: warsaw });
polishSenate.setStandard(100);
polishSenate.setSize(50);


let moscow = new Region('Moscow', russia);
let stpetersburg = new Region('Saint Petersburg', russia);

let russianSenate = new Site({ name: 'Senate', region: moscow });
russianSenate.setStandard(100);
russianSenate.setSize(50);


let london = new Region('London', uk);
let cardiff = new Region('Cardiff', uk);

let ukSenate = new Site({ name: 'Senate', region: london });
ukSenate.setStandard(100);
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

/****** STARTUP *******/

world.save('./template-save.json');


service.init();
world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
