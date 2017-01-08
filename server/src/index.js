let world = require('./singletons/world');
let Player = require('./classes/player');
let Country = require('./classes/country');
let Region = require('./classes/region');
let Mercenary = require('./classes/mercenary');
let Fact = require('./classes/fact');
let Worldview = require('./classes/worldview');

world.load('./templateSave.json');

world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
