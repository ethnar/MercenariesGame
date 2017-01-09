
let toronto = new Region('Toronto', world.entities.Country[0]);
let quebec = new Region('Quebec City', world.entities.Country[0]);

let canadianSenate = new Site('Senate', quebec);
canadianSenate.setStandard(100);
canadianSenate.setSize(50);


let dheli = new Region('Dheli', world.entities.Country[1]);
let kolkata = new Region('Kolkata', world.entities.Country[1]);

let indianSenate = new Site('Senate', dheli);
indianSenate.setStandard(100);
indianSenate.setSize(50);


let warsaw = new Region('Warsaw', world.entities.Country[2]);
let krakow = new Region('Krakow', world.entities.Country[2]);

let polishSenate = new Site('Senate', warsaw);
polishSenate.setStandard(100);
polishSenate.setSize(50);


let moscow = new Region('Moscow', world.entities.Country[3]);
let stpetersburg = new Region('Saint Petersburg', world.entities.Country[3]);

let russianSenate = new Site('Senate', moscow);
russianSenate.setStandard(100);
russianSenate.setSize(50);


let london = new Region('London', world.entities.Country[4]);
let cardiff = new Region('Cardiff', world.entities.Country[4]);

let ukSenate = new Site('Senate', london);
ukSenate.setStandard(100);
ukSenate.setSize(50);


let hq = new Site('HQ', london);
hq.setOwner(world.entities.Player[0]);
