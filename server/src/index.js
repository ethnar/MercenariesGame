let world = require('./singletons/world');
let Player = require('./classes/player');
let Country = require('./classes/country');
let Region = require('./classes/region');
let Mercenary = require('./classes/mercenary');
let Fact = require('./classes/fact');
let Site = require('./classes/site');
let Mission = require('./classes/mission');
let Worldview = require('./classes/worldview');

world.load('./template-save.json');

world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
