let world = require('./singletons/world');
//world.load('./save');
let Player = require('./classes/player');

let player = new Player('ethnar', 'abc');

world.save('./save');
world.load('./save');

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
