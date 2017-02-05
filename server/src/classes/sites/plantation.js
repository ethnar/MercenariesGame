const Site = require('../site');
const Fact = require('../fact');
const Entity = require('../entity');
const misc = require('../../singletons/misc');

class Plantation extends Site {
    constructor (args) {
        super(args);

        this.region = args.region;
        this.crop = args.crop || misc.randomEntity(Plantation.crops);
        this.name = 'Plantation';

        this.striking = false;
        this.slavery = this.region.getWorldview().chances('slavery', 2);
    }
    getLabelPayload () {
        return '{Site:' + this.id + ':' + this.getLabel() + '}';
    }

    getRegion () {
        return this.region;
    }

    cycle (cycles) {
        if (cycles.rare)
        {
            //noinspection DuplicateCaseLabelJS
            switch (true)
            {
                case this.slavery && misc.chances(3):
                    new Fact(8, 'A fatal accident has happened in %s, %s', this, this.getRegion());
                    break;
                case !this.slavery && misc.chances(1) && !this.striking:
                    new Fact(30, 'A strike has begun in %s, %s', this, this.getRegion());
                    this.striking = true;
                    break;
                    // TODO: we could include rebellion?
                case this.slavery && this.striking:
                    new Fact(40, 'A strike has ended in %s, %s', this, this.getRegion());
                    new Fact(2, 'A strike was brutally ended in %s, %s', this, this.getRegion());
                    this.striking = false;
                    break;
                case !this.slavery && misc.chances(1) && this.striking:
                    new Fact(40, 'A strike has ended in %s, %s', this, this.getRegion());
                    this.striking = false;
                    break;
                case misc.chances(1):
                    new Fact(40, 'A new shaft was opened in %s, %s', this, this.getRegion());
                    break;
                case misc.chances(5):
                    new Fact(40, 'A %s, %s is running into financial problems due to drought', this, this.getRegion());
                    break;
                case misc.chances(4):
                    new Fact(40, 'A big transport has just arrived at %s, %s', this, this.getRegion());
                    if (this.slavery && misc.chances(30))
                    {
                        new Fact(10, 'Several trucks transporting people just arrived at %s, %s', this, this.getRegion());
                    }
                    break;
            }
            // acqusition
            // new shaft
            // festival - no slavery
            // transport to another site - environment impact
            // contract with another site (power plant?) - environment impact
            // new resource
        }
    }

    getPossibleMissions(){
        return Mine.missions.filter(mission => mission.condition(this));
    }

    setStriking(value){
        this.striking = value;
    }
}

Plantation.crops = {
    rice: 0,
    sugarcane: 1,
    tea: 2,
    rapeseed: 3,
    tobacco: 4,
    cotton: 5,
    cannabis:6
}

Plantation.missions = []; //TODO

Entity.registerClass(Plantation);
module.exports = Plantation;