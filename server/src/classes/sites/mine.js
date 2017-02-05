const Site = require('../site');
const Fact = require('../fact');
const Entity = require('../entity');
const misc = require('../../singletons/misc');

class Mine extends Site {
    constructor (args) {
        super(args);

        this.region = args.region;
        this.resource = args.resource || misc.randomEntity(Mine.resources);
        this.name = 'Mine';

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
                case this.slavery && misc.chances(5):
                    new Fact(8, 'A fatal accident has happened in %s, %s', this, this.getRegion());
                    break;
                case !this.slavery && misc.chances(1):
                    new Fact(10, 'A fatal accident has happened in %s, %s', this, this.getRegion());
                    break;
                case !this.slavery && misc.chances(1):
                    new Fact(25, 'An accident has happened in %s, %s, trapped miners were rescued', this, this.getRegion());
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
                case misc.chances(1):
                    new Fact(40, 'A %s, %s is running into financial problems', this, this.getRegion());
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

Mine.resources = {
    coal: 0,
    sulphur: 1,
    iron: 2,
    gold: 3,
    diamond: 4
}

Mine.missions = [
    {
        title: 'Encite a strike',
        description:'We need to destabilise operations in this mine. I need you to orchestrate a strike by distributing leaflets.',
        condition: (mine) => (!mine.striking && mine.resource === Mine.resources.coal),
        impact: {
            environmentalism: 5
        },
        success: (mission, mine) => {
            mine.setStriking(true);
            let fact = new Fact(30, 'A strike has begun in %s, %s', mine, mine.getRegion());
            mission.getContractedPlayer().addKnownFact(fact);
        },
        failure: (mission, mine) => {}
    },
    {
        title: 'Surpress a strike',
        description:'We need to re-establish operations in this mine. I need you to surpress the strike happening there.',
        condition: (mine) => (mine.striking && mine.resource === Mine.resources.coal),
        impact: {
            environmentalism: -5
        },
        success: (mission, mine) => {
            mine.setStriking(false);
            let fact = new Fact(40, 'A strike has ended in %s, %s', mine, mine.getRegion());
            mission.getContractedPlayer().addKnownFact(fact);
        },
        failure: (mission, mine) => {}
    }
];

Entity.registerClass(Mine);
module.exports = Mine;