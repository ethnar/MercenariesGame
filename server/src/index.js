let world = require('./singletons/world');
let service = require('./singletons/service');
let Player = require('./classes/player');
let Politician = require('./classes/politician');
let Country = require('./classes/country');
let Region = require('./classes/region');
let Staff = require('./classes/staff');
let Fact = require('./classes/fact');
let Site = require('./classes/site');
let Mission = require('./classes/mission');
let Worldview = require('./classes/worldview');

world.load('./rolling-save.json');

service.init();
world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
