let world = require('./singletons/world');
let Player = require('./classes/player');
let Country = require('./classes/country');
let Region = require('./classes/region');
let Mercenary = require('./classes/mercenary');
let Fact = require('./classes/fact');
let Worldview = require('./classes/worldview');

world.load('./templateSave.json');

new Country('Canada');
new Country('India');
new Country('Poland');
new Country('Russia');
new Country('United Kingdom');

world.save('./save.json');

world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
