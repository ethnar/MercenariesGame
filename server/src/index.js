let world = require('./singletons/world');
//world.load('./save');
let Player = require('./classes/player');

let player = new Player('ethnar', 'abc');

world.save('./save');
world.load('./save');

console.log(world.entities.Player[0]);

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
