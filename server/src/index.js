let Service = require('./classes/service');
global.service = new Service();

let World = require('./classes/world');
let Player = require('./classes/player');

global.world = new World();
let player = new Player('ethnar', 'abc');

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
